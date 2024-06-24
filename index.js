import express from "express";
import axios from "axios";
import bodyParser from "body-parser";

const config = {
    params: { appid: "5b6bbbf72b43297c8a171bb4a2e6f473" }
  };


const app=express();
const port=3000;


app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true}));


app.get("/", (req,res) => {
    res.render("index.ejs");
})


  
  //API USED
  //1. TIME API -> GIVE TIME BASED ON LATITUDE AND LONGITUDE
  //2. CURRENT WEATHER - OPEN WEATHER API -> CURRENT WEATHER
  //3. FIVEDAYS-3HOUR FORECAST - OPEN WEATHER API
  
  app.post("/get-forecast", async (req, res) => {
  // RECEVING LATITUDE AND LONGITUDE FROM THE USER
      const searchLatitude = req.body.latitude;
      const searchLongitude = req.body.longitude;

      const location = searchLatitude + ", " + searchLongitude;
      console.log(searchLatitude);
      console.log(searchLongitude);
      console.log(location);
  
      
  
      try {
        const currentHourJSON = await axios.get(`https://timeapi.io/api/Time/current/coordinate?latitude=${searchLatitude}&longitude=${searchLongitude}`);
        const currentForecastJSON = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${searchLatitude}&lon=${searchLongitude}&units=metric`, config);
        const fiveHourForecastJSON = await axios.get(`https://api.openweathermap.org/data/2.5/forecast?lat=${searchLatitude}&lon=${searchLongitude}&units=metric`, config);
        res.render("index.ejs", { 
          currentContent: currentForecastJSON.data,
          fiveHourContent: fiveHourForecastJSON.data, 
          currentHour: currentHourJSON.data,
          map: location,
        });
      } catch (error) {
        //res.render("index.ejs", { error: error.response.data,fiveHourContent: error.response.data   });
        res.redirect("/");
      }

    });



    app.post("/get-forecast-city", async (req, res) => {
      // RECEVING CITY/TOWN NAME FROM THE USER

          const city=req.body.city_name;
          console.log(city);

          
          
      
          try {
            const city_data = await axios.get(`http://api.openweathermap.org/geo/1.0/direct?q=${city}&units=metric`, config);
            const data_s = city_data.data;
            const searchLatitude= JSON.stringify(data_s[0].lat);
            const searchLongitude= JSON.stringify(data_s[0].lon);

            const location = searchLatitude + ", " + searchLongitude;
          
            console.log(searchLatitude);
            console.log(searchLongitude);
            console.log(location);
            const currentHourJSON = await axios.get(`https://timeapi.io/api/Time/current/coordinate?latitude=${searchLatitude}&longitude=${searchLongitude}`);
            const currentForecastJSON = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${searchLatitude}&lon=${searchLongitude}&units=metric`, config);
            const fiveHourForecastJSON = await axios.get(`https://api.openweathermap.org/data/2.5/forecast?lat=${searchLatitude}&lon=${searchLongitude}&units=metric`, config);
            res.render("index.ejs", { 
              currentContent: currentForecastJSON.data,
              fiveHourContent: fiveHourForecastJSON.data, 
              currentHour: currentHourJSON.data,
              map: location,
            });
          } catch (error) {
            res.redirect("/");
          }
        
       

        });


app.listen(port, () => {
    console.log(`Server running at port: ${port}`);
})

