import { Button, Card, CardActions, CardContent, CardMedia, Typography } from "@mui/material"
import { Link, useNavigate, useParams } from "react-router";
import { useActivities } from "../../../lib/types/hooks/useActivities";

export default function ActivityDetails() {

  const navigate = useNavigate();

  const {id} = useParams();
  const {activity, isLoadingActivity} = useActivities(id);
  // const activity = {} as Activity;

  if (isLoadingActivity) return <Typography>Loading Activity...</Typography>

  if (!activity) return <Typography>Activity Not Found</Typography>

  return (
    <Card sx={{borderRadius: 3}}>
        <CardMedia component='img' src={`/Images/categoryImages/${activity.category}.jpg`}/>
        <CardContent>
            <Typography variant="h5">{activity.title}</Typography>
            <Typography variant="subtitle1" fontWeight={'light'}>{activity.date}</Typography>
            <Typography variant="body1">{activity.description}</Typography>
        </CardContent>
        <CardActions>
            <Button component={Link} to={`/manage/${activity.id}`} color="primary">Edit</Button>
            <Button onClick={() => navigate('/activities')} color="secondary">Cancel</Button>
        </CardActions>
    </Card>
  )
}