# PixiUI-FancyButton-Bug
To reproduce: Clone repo open terminal in the cloned directory execute: npm install npm run start

open browser window to localhost:1234

confirm that events are firing on the blue square

go into src/main.ts and uncomment line 103 (the last statement in the file) save and switch focus to the browser

confirm that events are firing properly on the green square, confirm clicking on fancy button fires the expected event (logging statement) confirm move event is firing everywhere else for fancy button (the red square) outside of expected operations
