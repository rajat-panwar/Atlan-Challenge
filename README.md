<h1 align="center">[SQL Editor - Made in React](https://senior-frontend-challenge-rajat-panwar.vercel.app/)</h1>
<br>

Link to the application - https://senior-frontend-challenge-rajat-panwar.vercel.app/
<br>

## Overview
This application is created using nextjs bootstrapped with create-react-app. 

This is a dummy application specific to problem statement given by atlan and it's not a full fledged sql-editor.

## Major Dependencies
- react-virtual ```2.10.4``` - to optimise rendering of large number of rows.
- alasql ```2.0.5``` - to convert csv to json object.
- @uiw/react-codemirror ```4.12.3``` - Editor to write sql query.

## Performance
1. I used Chrome Dev Tools Lighthouse to check the performance of overall application.

2. For measuring rendering of large number of rows in application without lagging I have used Chrome Dev Tools Frames Per Second Meter giving range between 57-58.5 FPS.

I'm attaching pdf and screenshot of Lighthouse report below.

[Lighthouse-report.pdf](https://github.com/rajat-panwar/Atlan-Challenge/files/9697973/Lighthouse-report.pdf)
<br>
<img width="1792" alt="Screenshot 2022-10-03 at 7 08 08 PM" src="https://user-images.githubusercontent.com/61053683/193592665-ce5b3755-6b30-4455-becd-582f670675f0.png">



## Optimisation
- Used React.memo, dynamic import of components, memoize the response of api calls to improve the overall performance of application.
- In case of more than 1k rows in result of a query, used react-virtualize to render and update DOM as per user view port and not keeping the whole number of elements in DOM.
