import { Grid2 } from "@mui/material";
import ActiviltyList from "./ActiviltyList";


export default function ActivityDashboard() {

  return (
    <Grid2 container spacing={3}>
        <Grid2 size={7}>
            <ActiviltyList />
        </Grid2>
        <Grid2 size={5}>
            Activity Filters go here
        </Grid2>
    </Grid2>
  )
}