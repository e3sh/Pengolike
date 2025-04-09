// mazemake 
//
// operation function propaty method
// createObject: map = new mazemake(w, h);// mapsize
// initialize/reset : map.init();

// mapcreateComplite: map.ready (true/false) neg. false/complite, true/running ?busy

//map.draw(map.wall, "dsp_d");//DOM <p> Draw wall(array);
//map.draw(map.floo, "dsp_e");

function mazemake(layer, w , h){

    let map_wall;
    let map_floor;

    this.wall = map_wall;  
    this.floo = map_floor;  

    this.ready;

    this.MW = w;
    this.MH = h; 

    //this.draw = mapdraw;
    this.draw = maptiledraw;//mapcanvasdraw;

    this.blockposlist = blockposlist;// 
    this.blockmap = blockmap;

    let mlog;
    let x; 
    let y;
    let r;

    const LAYER = layer;
    const MAP_W = w;
    const MAP_H = h;

    const BGBLOCK = 0;
    const BGFLOOR = 44//35; 
    const BGWALL  = 7;

    this.BG = {BLOCK:BGBLOCK, BONUS:10, FLOOR:BGFLOOR, WALL:BGWALL, FLAG:49, BFLAG:50, MAP_W:MAP_W, MAP_H:MAP_H };

    const vx = [ 0, 1, 0, -1 ]; const vy = [ -1, 0, 1, 0];


    this.init = function(){

        map_wall = fillarray(MAP_W, MAP_H, true);  
        map_floor = fillarray(MAP_W, MAP_H, true);  

        for (let i=1; i<MAP_H; i+=2){
            for (let j=1; j<MAP_W; j+=2){

                //map_wall[i][j]   = false;
                map_floor[i][j]   = false;
            }   
        }

        this.ready = false;
        x = 1;//Math.trunc(MAP_W/2) + 1;
        y = 1;//Math.trunc(MAP_H/2) + 1;
        r = 2;

        mlog = [];

        map_floor[y][x] = true;
        mlog.push({x:x, y:y});

        mapframedraw();
    }

    this.step = function(){

        if (this.ready) return;
    
        if (check(x, y, r)){

            map_wall[y][x]   = false;
            map_wall[y+vy[r]][x+vx[r]]   = false;
            map_floor[y+vy[r]*2][x+vx[r]*2]  = true;

            x += vx[r]*2;
            y += vy[r]*2;

            mlog.push({x:x, y:y});
        }else{
            map_wall[y][x]   = false;

            let wr = -1;
            for (let i=0; i<4; i++){
                if (check(x, y, i)){
                    wr = i;
                }
            }
            if (wr == -1){
                let w = mlog.pop();
                //if (mlog.length>0){ w = mlog.pop() };
                x = w.x; y = w.y;

                r = (r+2)%4
            }
        }
        if (Math.random()*3 < 1) {
            let vr = (Math.random()*2 < 1)?1:3;
            r = (r+vr)%4; 
        }

        if (!blankcheck(map_floor)){ this.ready = true;}

        this.wall = map_wall;  
        this.floo = map_floor;  

    }

    function check(x, y, r){
        let f = false;
        if ((x+vx[r]*2 >= 1)&&(x+vx[r]*2 < MAP_W-1)&&(y+vy[r]*2 >= 1)&&(y+vy[r]*2 < MAP_H-1)){
            if (!(map_floor[ (y+vy[r]*2) ][ (x+vx[r]*2) ])){
                f = true;
            }else{
                f= false;
            }
        }else{
            f= false;
        }
        return f;
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

    function blankcheck(map){//BLANKCHECK
        let flg = false;
        for (let i in map){
            for (let j in map[i]){
                if (map[i][j]){
                    //st += "■"; wall
                    //flg = true;
                } else {
                    //st += "□"; blank 
                    flg = true;
                }
            }
            //st += "<br>";
        }
        //document.getElementById(id).innerHTML = st;
        return flg;
    }
    function mapframedraw(){

      //flame draw
      for (let j=0; j<MAP_W; j++){//x
        LAYER.putTileAt(BGWALL,j, 0);
        LAYER.putTileAt(BGWALL,j,MAP_H-1);
        LAYER.putTileAt(BGWALL,0, j);
        LAYER.putTileAt(BGWALL,MAP_W-1,j);
        for (let i=1; i<MAP_W-1; i++) if (j!=MAP_H-1) layer.putTileAt(BGFLOOR, i, j);
      }
    }

    function maptiledraw(endf){

        let flg = false;
        for (let i in map_wall){
            if (i<1 || i>= MAP_W-1) continue;
            for (let j in map_wall[i]){
                if (j<1 || j>= MAP_H-1) continue;
                if (map_wall[i][j]){
                    if (LAYER.getTileAt(i,j) != BGBLOCK) LAYER.putTileAt(BGBLOCK,i,j);
                    //flg = true;
                } else {
                    if (LAYER.getTileAt(i,j) != BGFLOOR) LAYER.putTileAt(BGFLOOR,i,j);
                    flg = true;
                }
            }
        }
        if (endf){
            for (let i=1; i<MAP_H; i=i+2){//y
                for (let j=1; j<MAP_W; j=j+2){//x
                    LAYER.putTileAt(BGFLOOR,j, i);
                }
              }
        }

        return flg;
    }

    function blockposlist(blocktype=BGBLOCK){

        let list = [];
        for (let i=1; i<MAP_H-1; i++){
            for (let j=1; j<MAP_W-1; j++){
                if (LAYER.getTileAt(j,i).index == blocktype){
                    list.push({x:j, y:i});
                }
            }
        }
        return list;
    }

    function blockmap(nowLAYER){

        let st = "";
        let list = [];
        for (let i=0; i<MAP_H; i++){
            list[i] = [];
            st = "";
            for (let j=0; j<MAP_W; j++){
                list[i][j] = (nowLAYER.getTileAt(j,i).index != BGFLOOR)?true:false;
                if (nowLAYER.getTileAt(j,i).index == this.BG.FLAG) list[i][j] = false;
                st = st + ((list[i][j])?"*":"_");
            }
            //console.log(i + ":" + st);
        }
        return list;
    }

}