const express = require('express');
const router = express.Router();
const mysql = require('mysql2');
const cron = require('node-cron');

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


// // 1분 후에 만료된 데이터 삭제
// setTimeout(function() {
//   console.log('Running a job 1 minute from now');

//   const deleteQuery = 'DELETE FROM list WHERE DATE(time) < CURDATE()';
//   connection.query(deleteQuery, (err, results) => {
//     if (err) {
//       console.error('데이터 삭제 실패:', err);
//       return;
//     }
//     console.log(`Deleted ${results.affectedRows} row(s)`);
//   });
// }, 60000); // 60000ms = 1분


// 매일 자정에 전날 데이터 삭제
cron.schedule('0 0 * * *', function() {
  console.log('Running a job at 00:00 at Korea/Seoul timezone');

  const deleteQuery = 'DELETE FROM list WHERE DATE(time) < CURDATE()';
  connection.query(deleteQuery, (err, results) => {
    if (err)  {
      console.error('데이터 삭제 실패:', err);
      return;
    }
    console.log(`Deleted ${results.affectedRows} row(s)`);
  });
});

module.exports = router;