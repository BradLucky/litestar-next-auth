from os import urandom
from dataclasses import dataclass
from typing import Any, Literal
from uuid import UUID, uuid4

from litestar import Litestar, Request, Response, get, post
from litestar.config.cors import CORSConfig
from litestar.connection import ASGIConnection
from litestar.exceptions import NotAuthorizedException
from litestar.middleware.session.client_side import (
    ClientSideSessionBackend,
    CookieBackendConfig,
)
from litestar.security.session_auth import SessionAuth
from litestar.stores.memory import MemoryStore


@dataclass
class User:
    id: UUID
    name: str
    email: str


@dataclass
class UserLoginPayload:
    email: str
    password: str


MOCK_DB: dict[str, User] = {}
memory_store = MemoryStore()


async def startup() -> None:
    user = User(name="Name", email="a@a.com", id=uuid4())
    await memory_store.set(user.email, str(user.id))
    MOCK_DB[str(user.id)] = user


async def retrieve_user_handler(
    session: dict[str, Any], connection: ASGIConnection[Any, Any, Any, Any]
) -> User | None:
    return MOCK_DB.get(user_id) if (user_id := session.get("user_id")) else None


@post("/login")
async def login(data: UserLoginPayload, request: Request[Any, Any, Any]) -> User:
    user_id = await memory_store.get(data.email)

    if not user_id:
        raise NotAuthorizedException
    user_id = user_id.decode("utf-8")

    request.set_session({"user_id": user_id})

    return MOCK_DB[user_id]


@post("/logout")
async def logout(request: Request) -> Response:
    if request.session:
        request.clear_session()

    return Response({"message": "OK"}, status_code=200)


@get("/user", sync_to_thread=False)
def get_user(request: Request[User, dict[Literal["user_id"], str], Any]) -> Any:
    return request.user


session_auth = SessionAuth[User, ClientSideSessionBackend](
    retrieve_user_handler=retrieve_user_handler,
    session_backend_config=CookieBackendConfig(secret=urandom(16)),
    exclude=["/login", "/schema", "/logout"],
)

cors_config = CORSConfig(
    allow_origins=["http://localhost:3000"], allow_credentials=True
)


app = Litestar(
    route_handlers=[login, logout, get_user],
    on_app_init=[session_auth.on_app_init],
    cors_config=cors_config,
    on_startup=[startup],
)
