import express from "express";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();
const app = express();
const api_key = process.env.WEATHERAPIKEY;
const port = process.env.PORT || 7842;

app.use(express.urlencoded({ extended: true }));
app.use(express.static("Public"));

app.get(["/", "/home"], async (req, res) => {
  res.status(200).render("index.ejs");
});

app.get("/weather", async (req, res) => {
  res.status(200).render("weather.ejs");
});

app.get("/about", async (req, res) => {
  res.status(200).render("about.ejs");
});

app.post("/weather", async (req, res) => {
  let location = req.body.location;
  location = location
    .toLowerCase()
    .split(" ")
    .map((word) => {
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ");

  try {
    const result = await axios.get(
      `http://api.weatherstack.com/current?access_key=${api_key}`,
      { params: { query: `${location}` } }
    );

    let [city, country] = result.data.request.query.split(", ");
    let [date] = result.data.location.localtime.split(" ");
    let wind_direction = "";
    if (result.data.current.wind_dir == "N") {
      wind_direction = "North";
    } else if (result.data.current.wind_dir == "E") {
      wind_direction = "East";
    } else if (result.data.current.wind_dir == "S") {
      wind_direction = "South";
    } else {
      wind_direction = "West";
    }

    res.status(201).render("weather.ejs", {
      data: {
        city: city,
        country: country,
        date: date,
        time: result.data.current.observation_time,
        icon: result.data.current.weather_icons[0],
        description: result.data.current.weather_descriptions[0],
        wind_speed: result.data.current.wind_speed,
        wind_direction: wind_direction,
        temperature: result.data.current.temperature,
      },
    });
  } catch (err) {
    res.status(404).render("404.ejs",{message:'Probably wrong spelling in your location.'});
  }
});

app.use((req, res, next) => {
  res.status(404).render("404.ejs",{message:'Probably wrong URL address.'});
});

app.listen(port, (err) => {
  if (err) console.log(`Error Occured : ${err}`);
  console.log(`Server is listening on port : ${port}`);
});
