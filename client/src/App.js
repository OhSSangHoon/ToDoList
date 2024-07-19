import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Button, Container } from 'react-bootstrap';
import './App.css';

function App() {
  const [listcol, setListcol] = useState('');
  const [listData, setListData] = useState([]);

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:8080/lists');
      setListData(response.data);
    } catch (error) {
      console.error('데이터를 가져오는 중 오류 발생!', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8080/add-list', { listcol });
      console.log(response.data);
      setListcol('');
      fetchData();
    } catch (error) {
      console.error('There was an error!', error);
    }
  };

  const handleDelete = async (no) => {
    try {
      console.log(`삭제 요청: no = ${no}`); // 로그 추가
      const response = await axios.delete(`http://localhost:8080/delete/${no}`);
      console.log('삭제 성공: ', response.data);
      fetchData();
    } catch (error) {
      console.error('데이터 삭제 실패', error);
    }
  };

  return (
    <Container className="mb-5">
      <h1>To Do</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-floating">
          <input
            className="form-control"
            type="text"
            value={listcol}
            onChange={(e) => setListcol(e.target.value)}
          />
          <label>To Do</label>
        </div>
        <Button disabled={!listcol} type="submit">작성</Button>
      </form>
      <div className="container mt-5">
        {listData.map((item, index) => (
          <div className="list m-1" key={index}>
            <p>{item.listcol}</p>
            <Button variant="danger" onClick={() => handleDelete(item.no)}>삭제</Button>
          </div>
        ))}
      </div>
    </Container>
  );
}

export default App;