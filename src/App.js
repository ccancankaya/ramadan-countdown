import React, { useEffect, useState } from "react";
import './App.css';
import times from './times.json';
import day from './img/day.jpg'
import rainy from './img/rainy.jpg'
import cloudy from './img/cloudy.jpg'
import heavyrain from './img/heavyrain.jpg'
import nigth from './img/nigth.jpg'
import sunny from './img/sunny.jpg'
import thunder from './img/thunder.jpg'
import broken from './img/broken.jpg'
import sunset from './img/sunset.jpg'
import lightrain from './img/lightrain.jpg'




import axios from 'axios';

function App() {

  const [hourLeft, setHourLeft] = useState(0);
  const [minLeft, setMinLeft] = useState();
  const [secLeft, setSecLeft] = useState();
  const [temp,setTemp]=useState(0);
  const [desc,setDesc]=useState('');
  const [hum,setHum]=useState(0);
  const [wetPic,setWetPic]=useState(null);
  const [pic,setPic]=useState(null);
  const [classa,setClassa]=useState('');
  const [date,setDate]=useState(new Date().getTime());
  const [cat,setCat]=useState(null);



  const calculateTimeLeft = () => {

    times.forEach(data => {
      if (data.MiladiTarihKisa === new Date().toLocaleDateString('TR')) {
        let diff = new Date(2022, 4, new Date().getDay(), parseInt(data.Aksam), parseInt(data.Aksam.substring(3, 7)), 0).getTime() - new Date().getTime();
        setHourLeft(new Date(diff).getHours() - 2);
        setMinLeft(new Date(diff).getMinutes());
        setSecLeft(new Date(diff).getSeconds());
      }
    })
  };

  useEffect(()=>{
    axios.get('https://api.thecatapi.com/v1/images/search',
      {headers:{
        'x-api-key':'569e2620-8ffc-43d9-b420-3f9b2826137f'
      }})
      .then(res=>{

        setCat(res.data[0].url)
      })
    setInterval(() => {
      axios.get('https://api.thecatapi.com/v1/images/search',
      {headers:{
        'x-api-key':'569e2620-8ffc-43d9-b420-3f9b2826137f'
      }})
      .then(res=>{

        setCat(res.data[0].url)
      })
    }, 180000);
  },[])

  useEffect(()=>{
    axios.get('https://api.openweathermap.org/data/2.5/weather?q=istanbul&appid=b06236c94b527256394b6fdb1d99d5c9&units=metric&lang=tr')
    .then(res=>{
      setTemp(res.data.main.temp);
      setDesc(res.data.weather[0].description);
      setHum(res.data.main.humidity);
      if(res.data.weather[0].description==='hafif yağmur'){
        setClassa('rain')
        setWetPic(rainy)
      }
      if(res.data.weather[0].description==='açık'){
        setWetPic(sunny)
      }
      if(res.data.weather[0].description==='kapalı'){
        setWetPic(cloudy)
      }
      if(res.data.weather[0].description==='parçalı bulutlu'){
        setWetPic(broken)
           setClassa('brokenCloud')
      }
      if(res.data.weather[0].description==='kısa süreli hafif yoğunluklu yağmur'){
        setWetPic(lightrain)
          //  setClassa('brokenCloud')
      }
      
    })
  },[hourLeft])

  useEffect(() => {
    setDate(new Date().getTime());
    if(new Date().toLocaleTimeString('tr',{'hour':'2-digit'})>='20'||new Date().toLocaleTimeString('tr',{'hour':'2-digit'})<='06'){
      setPic(nigth)
    }else if(new Date().toLocaleTimeString('tr',{'hour':'2-digit'})>='07'||new Date().toLocaleTimeString('tr',{'hour':'2-digit'})<='16'){
      setPic(day)
    }else if(new Date().toLocaleTimeString('tr',{'hour':'2-digit'})>='17'||new Date().toLocaleTimeString('tr',{'hour':'2-digit'})<='19'){
      setPic(sunset)
    }
    setInterval(() => calculateTimeLeft(), 1000);
  }, [secLeft])


  return (
    <div className="container" >
      <nav className="navbar navbar-light bg-light">
        <div className="container-fluid">
          <span className="navbar-text">
            İftara Ne Kadar Kaldı?
          </span>
        </div>
      </nav>
      <div className="row">
        <div className="col-md-4">
          <div className="card bg-dark text-white">
            <img src={wetPic} class="card-img"  height="450" />
            <div className={`card-img-overlay ${classa}`}>
              <h2 className="card-title">Hava Durumu - İstanbul</h2>
              <h3 className="card-text">Sıcaklık : {temp} °C</h3>
              <h3 className="card-text">Durum : {desc} </h3>
              <h3 className="card-text">Nem : {'%'+hum} </h3>
              <p className="card-text" style={{marginTop:'52%'}}>Son güncelleme : 1 saat önce</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card bg-dark text-white">
            <img src={day} class="card-img" alt="..." height="450" style={{'filter':'brightness(50%)'}}/>
            <div className="card-img-overlay">
              <h5 className="card-title">Takvim | Türkiye Yerel Saati</h5>
              <p className="card-text date">{new Date(date).toLocaleDateString('tr')}</p>
              <p className="card-text date">{new Date(date).toLocaleString('tr',{'weekday':'long'})}</p>
              <p className="card-text date">{new Date(date).toLocaleTimeString('tr')}</p>
              <p className="card-text" style={{marginTop:'28%'}}>Saat dilimi : GMT+03:00</p>



            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card bg-dark text-white">
            <img src={cat} class="card-img" alt="..." height="450" style={{'filter':'brightness(75%)'}}/>
            <div className="card-img-overlay">
              <p className="card-text" style={{marginTop:'103%'}}>3 dakikada bir fotoğraf güncellenmektedir</p> 
            </div>
          </div>
        </div>
      </div>
      <div className="row main mt-3">
        <p>{hourLeft}:{minLeft}:{secLeft}</p>
      </div>
    </div>

  );
}

export default App;
