import React, { useState } from 'react';
import './App.scss';
import { Table } from 'antd';
import tutorial from "./tutorial.jpg"
import { FaFacebookSquare } from "react-icons/fa";



function App() {
  const [files, setFiles] = useState("");
  const [isShowTutorial, setIsShowTutorial] = useState(false)
  const [name1, setName1] = useState("")
  const [name2, setName2] = useState("")

  function decode(s) {
   let d = new TextDecoder();
   let a = s.split('').map(r => r.charCodeAt());
   return d.decode(new Uint8Array(a));
  }

  const columns = [
  {
    title: <p className='title-bold'>Date</p>,
    dataIndex: 'date',
    key: 'date',
    width: '15%',
    align:"center"
    // sorter: (a, b) =>
    //     new Date(a.date).getTime() - new Date(b.date).getTime(),
  },
  {
    title: <p className='title-bold'>Time</p>,
    dataIndex: 'time',
    key: 'time',
    align:"center",
    width: '20%'
  },
  {
    title: <p className='title-bold'>Content</p>,
    dataIndex: 'content',
    key: 'content',
    align:"center"
  },
  {
    title: <p className='title-bold'>Call duration</p>,
    dataIndex: 'call_duration',
    key: 'call_duration',
    width: '18%',
    align:"center",
    render: (text) => <p className='call-duration'>{text}</p>,
  },

  {
    title: <p className='title-bold'>Thao tác</p>,
    key: "action",
    align: "center",
    width: '15%',
    render: (record) => {
      return (
        <p
          className="delete-time"
          onClick={() => {
            console.log(record)
            if (window.confirm("Do you really delete this time ?")) {
              const objectToRemove = record
              let initalFile = files

              initalFile = initalFile.filter(obj => {
                return obj.timestamp_ms !== objectToRemove.timestamp_ms;
              });


              setFiles(initalFile)

            }else{
              return
            }
          }}
        >
          Xóa
        </p>
      );
    },
      },
 
];

  const handleChange = e => {
    
    const file = e.target.files[0];

    // Check if a file was selected
    if (!file) {
      console.error("No file selected.");
      setFiles("")
      return;
    }

    // Check if the file type is JSON
    if (file.type !== "application/json") {
      alert("Unsupported file type. Please upload a JSON file.");
      return;
    }

    const fileReader = new FileReader();

    fileReader.readAsText(e.target.files[0], "UTF-8");

    fileReader.onload = e => {
      const jsonData = JSON.parse(e.target.result);
  
      const messages = jsonData.messages

      const result = messages.filter(obj => obj.hasOwnProperty('call_duration')).reverse()

      // console.log(result)

      result.map((item) => {
        item.sender_name = decode(item.sender_name)
        item.content = decode(item.content)

        const timestamp = item.timestamp_ms
        let date = new Date(timestamp);

        // Extracting date components
        let year = date.getFullYear();
        let monthName = date.toLocaleString('en-US', { month: 'long' }); // Adding 1 because getMonth() returns 0 for January
        let day = ('0' + date.getDate()).slice(-2);

        // Extracting time components
        // let hours = ('0' + date.getHours()).slice(-2);
        // let minutes = ('0' + date.getMinutes()).slice(-2);
        // let seconds = ('0' + date.getSeconds()).slice(-2);

        let hours = date.getHours();
        let minutes = date.getMinutes();
        let seconds = date.getSeconds();
        let ampm = hours >= 12 ? 'PM' : 'AM';

        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        minutes = minutes < 10 ? '0' + minutes : minutes;
        seconds = seconds < 10 ? '0' + seconds : seconds;

        let strTime = hours + ':' + minutes + ':' + seconds + ' ' + ampm;

        // Storing date and time in variables
        let formattedDate = `${monthName} ${day},${year}`;
        let formattedTime = `${hours}:${minutes}:${seconds}`;

        item.date = formattedDate
        item.time = strTime

        const duration = item.call_duration
        // Calculate hours, minutes, and seconds
        let hours_duration = Math.floor(duration / 3600);
        let minutes_duration = Math.floor((duration % 3600) / 60);
        let seconds_duration = duration % 60;

        let formattedTime_duration = `${hours_duration.toString().padStart(2, '0')}:${minutes_duration.toString().padStart(2, '0')}:${seconds_duration.toString().padStart(2, '0')}`;
        item.call_duration = formattedTime_duration
      })
      

      
      const participate = jsonData.participants
      
      setName1(decode(participate[0].name))
      setName2(decode(participate[1].name))
      
      console.log(result)
      setFiles(result);
    };
  };

  return (
    <>
      <button className='tutorial'onClick={()=>{setIsShowTutorial(!isShowTutorial)}}>Hướng dẫn tải file JSON về PC</button>

      {isShowTutorial && <img src={tutorial} className='tutorial-image' alt=''/>}
      
      <h1>Upload JSON File using the button below</h1>

      <input type="file" onChange={handleChange} className='file-upload'/>
      <br />
    

      {files ? (
        <div>
          <Table scroll={{ y: 800 }} title={() => <div className='title-table'>Call logs between {name1} and {name2} on <FaFacebookSquare style={{color:"#0866FF", marginLeft:12}}/></div> } columns={columns} dataSource={files} className='table' pagination={false}/>
        </div>
      ) : (
        <p style={{marginTop: 15}}>No file uploaded or invalid JSON file.</p>
      )}
    </>
  );
}

export default App;