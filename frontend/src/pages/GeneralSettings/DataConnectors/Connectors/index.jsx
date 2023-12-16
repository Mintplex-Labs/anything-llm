import paths from "@/utils/paths";
import { lazy } from "react";
import { useParams } from "react-router-dom";
const Github = lazy(() => import("./Github"));

const CONNECTORS = {
  github: Github,
};

export default function DataConnectorSetup() {
  const { connector } = useParams();
  if (!connector || !CONNECTORS.hasOwnProperty(connector)) {
    window.location = paths.home();
    return;
  }

  const Page = CONNECTORS[connector];
  return <Page />;
}
