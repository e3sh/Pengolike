// routeCheck
// mode:0/1 
function routecheck(maze, mode=0){

    //左手法の場合 0 / 右手の場合は1
    const dvx = [[[ 0, 1, 0, -1], [ 1, 0, -1, 0], [ 0, -1, 0, 1], [ -1, 0, 1, 0]] 
                ,[[ 0, 1, 0, -1], [ 1, 0, -1, 0], [ 0, -1, 0, 1], [ -1 ,0, 1, 0]]]; 
 
    const dvy = [[[ -1, 0, 1,  0], [ 0, 1, 0, -1], [ 1, 0, -1, 0], [ 0, -1, 0, 1]] 
                ,[[ -1, 0, 1,  0], [ 0, -1, 0, 1], [ 1, 0, -1, 0], [ 0, 1, 0, -1]]]; 
 
    //let mode = 0;

    const svx = dvx[mode];
    const svy = dvy[mode];
    let vx;
    let vy;

    const dcolor = (mode == 0)?"red":"orange";

    let map;
    let st;
    let en;
    this.busy = false;
    this.ready = false;

    let route = [];
    let workmap;
    
    this.create = function(nowLayer, start, goal){

        map = maze.blockmap(nowLayer); 

        st = start;
        en = goal;

        let crv = 0; //0:u 1:l 2:d 3:r
        let lr = en.x - st.x;
        let ud = en.y - st.y;
        if (lr > ud){//X axis 
            crv = (lr>0)?1:3;
        }else{//Y axis
            crv = (ud>0)?2:0;
        }

        vx = svx[crv];
        vy = svy[crv];

        route = [];

        this.busy = true;
        this.ready = false;

        workmap = fillarray(map[0].length, map.length, 0);

        for (let i in map){
            for (let j in map[i]){
                if (map[i][j]){
                    workmap[i][j] = map[0].length*map.length;//wall
                } else {
                    workmap[i][j] = 0;
                }
            }
        }

        routedataCreate(st.x, st.y);

        this.busy = false;
        this.ready = true;
    }

    function fillarray(w , h, p){
        let ary = Array(h);
        ary.fill([]);
        for (let i in ary){
            ary[i] = Array(w);
            ary[i].fill(p);
        }
        return ary;
    }

    function routedataCreate( x, y ){

        routeCheck( x, y, 1);

        x = en.x;
        y = en.y;

        while (workmap[y][x] > 1){
            let wnum = workmap[y][x];

            let ri = -1;
            let wcnum = wnum;
            for (let i in vx){
                if (workmap[y+vy[i]][x+vx[i]] < wnum){
                    if (wcnum > workmap[y+vy[i]][x+vx[i]]){
                        ri = i;
                        wcnum = workmap[y+vy[i]][x+vx[i]];
                    }
                }
            }
            //console.log("ri"+ri);
            if (ri == -1) break;

            x = x + vx[ri];
            y = y + vy[ri];
            route.push({vx:-vx[ri], vy:-vy[ri], x:x, y:y});
        }
        //console.log("rl" + route.length);
    }

    function routeCheck( x, y, n ){

        if (workmap[y][x] !=0 ) return false;

        workmap[y][x] = n;

        for (let i in vx){
            routeCheck(x+vx[i], y+vy[i], n+1);
        }
        return true;
    }

    this.step = function(ctx){
        if (this.ready) {

            for (let i in route){    
                let p = route[i];

                //console.log("p" + p.x + "," + p.y)

                ctx.beginPath();
                ctx.fillStyle = dcolor;
                ctx.fillRect(p.x*4,p.y*4,3,3);
            }
        }

    }

    this.result = function(){
        return route;
    }

}
