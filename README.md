# Description
This module is for leading games or user ranking .  
# Install
- origamicore [Doc](https://github.com/vahidHossaini/origami#readme)
# Configuration
 
    {
        'context': '{db context name}',
        //redis data
        'port':6379 ,//6379 is default
        'host':'localhost',//localhost is default
        'db':0,//0 is default
    }
# Public Service
        /leaderboard/getTopTen?gameId=
        /leaderboard/getBoard?gameId=
# Internal Services

        //Set Score (replace)
        global.leaderboard.setScore(gameId,score,userid) 
        //Add to previous score (if not exist , create score)
        global.leaderboard.addScore(gameId,score,userid) 
        //Get Score
        global.leaderboard.getScore(gameId,userid) 
        //you can set and update user data on leaderboard
        global.leaderboard.updateUser(id,data) 