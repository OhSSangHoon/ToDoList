# ToDoList
React, node를 이용한 To Do List


<React 생성>
npx create-react-app filename


<bootstrap>
npm install react-bootstrap bootstrap


<node js 생성>
1. express 생성기 설치
npm install -g express-generator

2. 새 express 애플리케이션 생성
express filename

3. 종속성 설치

cd filename	#생성한 express 애플리케이션폴더로 이동
npm install		#설치


<사용 스택>
1. React
2. bootstrap
3. node js
4. mysql



<마우스 드래그로 게시글 순서 변경>
1. npm install react-beautiful-dnd 패키지 설치


ERROR Invariant failed: Cannot find droppable entry with id [droppable-1] at handleError
가 계속 발생해서 이유를 찾아보니
  // <React.StrictMode>와 호환되지않아서 문제를 일으키는것 같다.
그래서 index.js에서 해당 코드를 주석처리하니 잘 작동을한다. 