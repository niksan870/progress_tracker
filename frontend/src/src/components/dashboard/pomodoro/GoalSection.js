import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardContent from "@material-ui/core/CardContent";
// import Typography from "@material-ui/core/Typography";

export default function GoalSection({ data }) {
  if (data != null) {
    return (
      <Card>
        <CardActionArea>
          <CardContent>
            <p gutterBottom variant="h5" component="h2">
              {data.title}
            </p>
            <p variant="body2" color="textSecondary" component="p">
              {data.description}
            </p>
            <p variant="body3" color="textThird" component="p">
              Expected time to be done today = {data.hours + ":" + data.minutes}{" "}
              hours
            </p>
          </CardContent>
        </CardActionArea>
      </Card>
    );
  } else {
    return <Card />;
  }
}
