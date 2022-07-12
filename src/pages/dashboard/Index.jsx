import { useContext} from "react";
import { UserContext } from "../../providers/user";
import DashboardPF from "../../components/dashboardModel/dashboardPF";
import DashboardPJ from "../../components/dashboardModel/dashboardPJ";
import DashboardEntity from "../../components/dashboardEntity";


export default function Dashboard() {
  const { user } = useContext(UserContext);

  if(user.type === "entity"){
    return (
      <DashboardEntity/>
    )
  }
  return (
    <>
      {user.type === "fisica" && <DashboardPF />}

      {user.type === "juridica" && <DashboardPJ />}

      {/*user.type === "entidade" && <DashboardEntity />*/}
    </>
  );
}
