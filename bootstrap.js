module.exports = class leaderboardBootstrap{
  constructor(config)
  {
    this.funcs=[
      {
          name:'getTopTen', 
          inputs:[
			{
				name:'gameId',
				type:'string',
				nullable:false
			}
          ]
      }, 
      {
          name:'getBoard', 
          inputs:[
			{
				name:'gameId',
				type:'string',
				nullable:false
			},
			{
				name:'userid',
				type:'string',
				nullable:false
			},
          ]
      }, 
      {
          name:'setScore',  
      }, 
      {
          name:'getScore',  
      }, 
      {
          name:'addScore',  
      }, 
      {
          name:'updateUser',  
      }, 
	  
	  
	   
    ]
    this.auth=[  
            {
                role: 'login',
                name: 'getTopTen'
            },
            {
                role: 'login',
                name: 'getBoard'
            },
        ]
  }
}