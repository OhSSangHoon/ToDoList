import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { Button, Container } from 'react-bootstrap';
import './App.css';

function App() {
  const [listcol, setListcol] = useState('');
  const [listData, setListData] = useState(() => {
    const savedData = localStorage.getItem('listData');
    return savedData ? JSON.parse(savedData) : [];
  });

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:8080/lists');
      const localData = localStorage.getItem('listData');
      if(localData){
        setListData(JSON.parse(localData));
      }else{
        setListData(response.data);
        localStorage.setItem('listData', JSON.stringify(response.data));
      }
    } catch (error) {
      console.error('데이터를 가져오는 중 오류 발생!', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    localStorage.setItem('listData', JSON.stringify(listData));
  }, [listData]);

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
      console.log(`삭제 요청: no = ${no}`);
      const response = await axios.delete(`http://localhost:8080/delete/${no}`);
      console.log('삭제 성공: ', response.data);
      fetchData();
    } catch (error) {
      console.error('데이터 삭제 실패', error);
    }
  };

  const handleOnDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(listData);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setListData(items);
    localStorage.setItem('listData', JSON.stringify(items)); // 변경된 순서 저장
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
      <DragDropContext onDragEnd={handleOnDragEnd}>
        <Droppable droppableId="droppableId">
          {(provided) => (
            <div
              className="container mt-5"
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              {listData.map((item, index) => (
                // index를 props로 설정해서 순서를 변경시키는데 사용한다.
                <Draggable key={item.no} draggableId={`draggable-${item.no}`} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className="list m-1 bg shadow-sm"
                    >
                      <p className="w-50 left">{item.listcol}</p>
                      <div className="w-25 right">
                        <Button variant="danger" className="btn" onClick={() => handleDelete(item.no)}>삭제</Button>
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </Container>
  );
}

export default App;