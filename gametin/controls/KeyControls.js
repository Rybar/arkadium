class KeyControls {
    constructor(){
        this.keys = {};
        //Bind event handlers
        document.addEventListener('keydown',e =>{
            if ([37,38,39,40].indexOf(e.which) >=0){
                e.preventDefault();
            }
            this.keys[e.which] = true;

        }, false);

        document.addEventListener('keyup', e => {
            this.keys[e.which] = false;
        }, false);
        

    }

    //handle key actions
    get action () {
        return this.keys[32]; //space
    }

    get x () {
        //left or A
        if (this.keys[37] ||  this.keys[65]) {
            return -1;
        }
        //right or D
        if (this.keys[39] || this.keys[68]) {
            return 1;
        }
        return 0;
    }
    
    get y () {
        //up or W
        if(this.keys[38] || this.keys[87]){
            return -1;
        }
        //down or S
        if(this.keys[40] || this.keys[83]){
            return 1;
        }
        return 0;
    }

    reset () {
        this.keys = {};
    }
}

export default KeyControls;

