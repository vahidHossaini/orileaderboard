var uuid=require("uuid");
var redis=require("redis");

class leaderboardManager
{

	constructor(disc)
	{
		this.disc=disc
	}
    setScore(gameId,score,userid,func)
	{  
        try{
            return this.disc.run('leaderboard','setScore',{gameId,score,userid},func)
            
        }catch(exp){console.log(exp)}
	}
    getScore(gameId,userid,func)
	{  
        try{
            return this.disc.run('leaderboard','getScore',{gameId,userid},func)
            
        }catch(exp){console.log(exp)}
	}
    addScore(gameId,score,userid,func)
	{  
        try{
            return this.disc.run('leaderboard','addScore',{gameId,score,userid},func)
            
        }catch(exp){console.log(exp)}
	}
    updateUser(id,data,func)
	{  
        try{
            return this.disc.run('leaderboard','addScore',{id,data},func)
            
        }catch(exp){console.log(exp)}
	}
}

module.exports = class leaderboardIndex
{
	constructor(config,dist)
	{
		this.config=config.statics
		this.context=this.config.context 
		this.userdata=this.config.userdata
        this.bootstrap=require('./bootstrap.js')
        this.enums=require('./struct.js') 
        this.tempConfig=require('./config.js')
        global.leaderboard=new leaderboardManager(dist)
        
		var conf={
			port:6379,
			host:'localhost',
			db:0
		};
		if(this.config.port)conf.port=this.config.port
		if(this.config.host)conf.host=this.config.host
		if(this.config.db)conf.db=this.config.db
        
		var c = redis.createClient(conf.port, conf.host);
		c.on('connect', function() {
			console.log('Redis -> redis connected '+conf.host);
		});
		c.select(conf.db, function(err,res){
			console.log('Redis -> redis on db : '+conf.db);
		});
		this.connection=c
		//global.acc=new accountManager(dist)
	}
    async convertUser(data)
    {
		var p=[];
		for(var a=0;a<data.length;a+=2)
		{
			var px= await this.getProfile(data[a])
			p.push({
				name:data[a],
				score:data[a+1],
				profile:px
			});
		}
        return p
    }
	async getProfile(id)
	{
		var c=this.config
		var data = await global.redis.GetValue(c.rcontext,id); 
		return data;
	}
	
	async updateUser(msg,func,self)
	{
		var c=this.config
		
		var data = await global.redis.SetValue(c.rcontext,msg.id,msg.data); 
		return func(null,data)
	}
	async getTopTen(msg,func,self)
	{
		var dt=msg.data;
        console.log('msg : ',dt)
		var session=msg.session;
        self.connection.zrevrange(dt.gameId,  0, 10, 'withscores', async function (err, response) { 
            if (err) return func({m:'leaderboard001'})
				
            return func(null,await self.convertUser(response));
        });  
	}
	async getBoard(msg,func,self)
	{
		var dt=msg.data;
		var session=msg.session; 
         
        self.connection.zrevrank(dt.gameId,session.userid, function (err, response) {
            if (err)  return func({m:'leaderboard001'}); 
            var begin=response-3
            var end=response+3
            if(begin<0)begin=0;
            self.connection.zrevrange(dt.gameId,  begin, end, 'withscores', function (err, response) { 
                if (err) return func({m:'leaderboard001'})
                return func(null,self.convertUser(response));
            });  
            
            //return func(null,response);
        });  
	}
	async setScore(msg,func,self)
	{ 
		var dt=msg;
		var session=msg.session; 
        console.log('000---->',msg)
        
        var a= self.connection.zadd(dt.gameId,dt.score,dt.userid) 
        console.log(a)
		return func(null,{});
	}
	async getScore(msg,func,self)
	{ 
		var dt=msg;
		var session=msg.session; 
        var a= self.connection.zscore(dt.gameId,dt.userid,function (err, response){
			 
		return func(null,response);
		})
	}
	async addScore(msg,func,self)
	{ 
		var dt=msg;
		var session=msg.session; 
        console.log('000---->',msg)
        
        var a= self.connection.zincrby(dt.gameId,dt.score,dt.userid) 
        console.log(a)
		return func(null,{});
	}
}

