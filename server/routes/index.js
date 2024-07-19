const express = require('express');
const router = express.Router();
const mysql = require('mysql2');
const schedule = require('node-schedule');

// MySQL 연결 설정
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'kim2580mi',
  database: 'todo'
});

// 데이터베이스 연결
connection.connect((err) => {
  if (err) {
    console.error('데이터베이스 연결 실패:', err);
    return;
  }
  console.log('데이터베이스 연결 성공');
});

// 데이터 삭제 작업 스케줄링
const job = schedule.scheduleJob('0 0 * * *', () => {
  const deleteQuery = 'DELETE FROM list WHERE time < NOW() - INTERVAL 1 DAY';

  connection.query(deleteQuery, (err, results) => {
    if (err) {
      console.log('데이터 삭제 실패: ', err);
    } else {
      console.log('자정에 모든 Todo 항목이 삭제되었습니다.');
    }
  });
});

// 기본 루트 라우트 설정
router.get('/', (req, res) => {
  res.send('Welcome to the Home Page!');
});

// 데이터 삽입
router.post('/add-list', (req, res) => {
  const insertQuery = 'INSERT INTO list (listcol) VALUES (?)';
  const listData = [req.body.listcol];

  connection.query(insertQuery, listData, (err, results) => {
    if (err) {
      console.error('데이터 삽입 실패:', err);
      return res.status(500).send('데이터 삽입 실패');
    }
    res.status(200).send(`데이터 삽입 성공: ${results.insertId}`);
  });
});

// 데이터 조회
router.get('/lists', (req, res) => {
  const selectQuery = 'SELECT * FROM list';

  connection.query(selectQuery, (err, results) => {
    if (err) {
      console.error('데이터 조회 실패:', err);
      return res.status(500).send('데이터 조회 실패');
    }
    res.status(200).json(results);
  });
});

// 데이터 삭제
router.delete('/delete/:no', (req, res) => {
  const deleteQuery = 'DELETE FROM list WHERE no = ?';
  const listNo = req.params.no;

  connection.query(deleteQuery, [listNo], (err, results) => {
    if (err) {
      console.error('데이터 삭제 실패:', err);
      return res.status(500).send('데이터 삭제 실패');
    }
    res.status(200).send('데이터 삭제 성공');
  });
});

module.exports = router;