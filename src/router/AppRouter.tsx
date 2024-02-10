import { useRoutes } from "raviger";
import About from "../components/About";
import AppContainer from "../AppContainer";
import { Form } from "../components/Form";
import { FormList } from "../components/FormList";
import { Home } from "../components/Home";
import { Preview } from "../components/Preview";

const routes = {
  "/": () => <Home />,
  "/about": () => <About />,
  "/forms": () => <FormList />,
  "/forms/:id": ({ id }: { id: string }) => <Form formId={Number(id)} />,
  "/preview/:id": ({ id }: { id: string }) => <Preview formId={Number(id)} />,
};

export default function AppRouter() {
  let routeResult = useRoutes(routes);
  return <AppContainer>{routeResult}</AppContainer>;
}
