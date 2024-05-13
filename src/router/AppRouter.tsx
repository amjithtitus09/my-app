import { useRoutes } from "raviger";
import About from "../components/About";
import AppContainer from "../AppContainer";
import { Form } from "../components/Form";
import { FormList } from "../components/FormList";
import { Home } from "../components/Home";
import { Preview } from "../components/Preview";
import { CreateForm } from "../components/CreateForm";
import Login from "../components/Login";
import { User } from "../types/userTypes";
import { CurrentUserContext } from "../context/CurrentUser";

const publicRoutes = {
  "/": () => <Home />,
  "/login": () => <Login />,
  "/about": () => <About />,
  "/forms": () => <FormList />,
  "*": () => <Home />,
};

const routes = {
  "/": () => <Home />,
  "/about": () => <About />,
  "/forms": () => <FormList />,
  "/forms/:id": ({ id }: { id: string }) => <Form formId={Number(id)} />,
  "/preview/:id": ({ id }: { id: string }) => <Preview formId={Number(id)} />,
  "*": () => <Home />,
};

export function PublicRouter(props: { currentUser: User }) {
  const routeResult = useRoutes(publicRoutes);
  return (
    <AppContainer currentUser={props.currentUser}>{routeResult}</AppContainer>
  );
}

export function PrivateRouter(props: { currentUser: User }) {
  const routeResult = useRoutes(routes);
  return (
    <AppContainer currentUser={props.currentUser}>{routeResult}</AppContainer>
  );
}

export default function AppRouter({ currentUser }: User) {
  const Router =
    currentUser?.username?.length > 0 ? PrivateRouter : PublicRouter;
  return (
    <CurrentUserContext.Provider value={currentUser}>
      <Router currentUser={currentUser} />
    </CurrentUserContext.Provider>
  );
}

