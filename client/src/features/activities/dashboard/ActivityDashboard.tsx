import { Grid2 } from "@mui/material";
import ActiviltyList from "./ActiviltyList";
import ActivityDetails from "./details/ActivityDetails";
import ActivityForm from "../form/ActivityForm";

type Props = {
    activities: Activity[]
    selectActivity: (id: string) => void
    cancelSelectActivity: () => void
    selectedActivity?: Activity
    editMode: boolean
    openForm: (id: string) => void
    closeForm: () => void
}

export default function ActivityDashboard({activities, cancelSelectActivity, selectActivity, selectedActivity, editMode, openForm, closeForm}: Props) {
  return (
    <Grid2 container spacing={3}>
        <Grid2 size={7}>
            <ActiviltyList activities={activities} selectActivity={selectActivity} />
        </Grid2>
        <Grid2 size={5}>
            {selectedActivity &&  !editMode &&
              <ActivityDetails 
                selectedActivity={selectedActivity} 
                cancelSelectActivity={cancelSelectActivity}
                openForm={openForm}

              />}
              {editMode && <ActivityForm closeForm={closeForm} activity={selectedActivity}/>}
        </Grid2>
    </Grid2>
  )
}