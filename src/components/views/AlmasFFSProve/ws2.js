import {observable, autorun} from 'mobx';
import {observer} from 'mobx-react';
import React from 'react';
import autobind from 'autobind-decorator';
import {NativeModules} from 'react-native';

var FfsComp = NativeModules.FfsComps;

@observer
export default class almasFFSC extends React.Component {
    @observable isLoading = true;

    @observable status = 'not set';

    // r and x are variables are defined in the...
    // ...Fiat-Shamir protocol.
    @observable r;
    @observable x;

    // stop it from re-sending same step
    @observable stepCheck = -1;


    constructor() {
        super();
    }

    mult = (strNum1,strNum2) => {
        var a1 = strNum1.split("").reverse();
        var a2 = strNum2.toString().split("").reverse();
        var aResult = new Array;
    
        for ( var iterNum1 = 0; iterNum1 < a1.length; iterNum1++ ) {
            for ( var iterNum2 = 0; iterNum2 < a2.length; iterNum2++ ) {
                var idxIter = iterNum1 + iterNum2;    // Get the current array position.
                aResult[idxIter] = a1[iterNum1] * a2[iterNum2] + ( idxIter >= aResult.length ? 0 : aResult[idxIter] );
    
                if ( aResult[idxIter] > 9 ) {    // Carrying
                    aResult[idxIter + 1] = Math.floor( aResult[idxIter] / 10 ) + ( idxIter + 1 >= aResult.length ? 0 : aResult[idxIter + 1] );
                    aResult[idxIter] %= 10;
                }
            }
        }
        return aResult.reverse().join("");
    }
    
    modulo = (aNumStr, aDiv) => {
        var tmp = "";
        var  i, r;
        for ( i=0; i<aNumStr.length ; i++)
        {
            tmp += aNumStr.charAt( i);
            r = tmp % aDiv;
            tmp = r.toString( 10);
        }
        return tmp / 1;
    }
    
    // Generate a unique r and calculate x from it
    /*
        {
        'type' : 'almasFFSMobile', 
        'forID': forID,
        'round' : rnd,
        'step' : 1,
        'data' : x
        }

        {
        'type' : 'almasFFSMobile',
        'forID': forID,
        'round' : 1,
        'step' : 0,
        'data' : inj
        }
    */

    @autobind
    sendX(msg, forID, ws, rnd = 1) {
        // Get the r and x value from the JAVA
        // Callback and parse it, then put it in state
        rxJSON = msg.replace(/'/g, '"')
        rxJSON = JSON.parse(rxJSON);
        this.r = rxJSON.r;
        this.x = rxJSON.x;

        let xJSON = JSON.stringify(this.jsonPayload(forID, rnd, 1, rxJSON.x));
        console.log("x:" + rxJSON.x)
        this.sendCheck(xJSON, ws);
    }

    @autobind
    sendY(msg, forID, ws, rnd, step) {
        // Get the r and y value from the JAVA
        // Callback and parse it, then put it in state
        ryJSON = msg.replace(/'/g, '"')
        ryJSON = JSON.parse(ryJSON);

        let yJSON = JSON.stringify(this.jsonPayload(forID, rnd, step, ryJSON.y));
        console.log("y:" + ryJSON.y)
        this.sendCheck(yJSON, ws);
    }


    // Check whether if we should be sending data
    sendCheck = (data, ws) => {
        ws.send(data);
    }

    // Common JSON payload
    jsonPayload = (forID, round, step, data) => {
    	let json = {
	        'type' : 'almasFFSMobile',
	        'forID': forID,
	        'round' : round,
	        'step' : step,
	        'data' : data
        }
        return json
    }
    
    /*
    FIAT-SHAMIR IDENTITY BASED CRYPTOSYSTEM

    Security concerns:
    > BigInts are not constant time in JavaScript therefore not secure to use
    */
    almasFFSSubmit = (data) => {
        data = JSON.parse(data);
        url = data['wsURL'];
        forID  = data['uID'];
        this.isLoading = true;
        this.status = 'not set';
        this.stepCheck = -1;
        var ws = new WebSocket(url);

        /*
        THIS MUST BE PULLED IN FROM THE LOCAL DEVICE RATHER THAN HARDCODED HERE
        CHANGE ASAP
        */
        var v = [2333866390, 91504984, 24182319, 2679948747, 2426252266, 1543844700, 2667701433, 437491298, 2039680765, 153121206],
            s = [1220448689, 386273255, 15269095, 79929288, 1066903174, 592861078, 278860438, 905288239, 536397697, 51542499],
            I = 'Sirvan Almasi || 26/01/1992 || Saqqez || Sirvan3tr@gmail.com',
            j = [879526612, 1864187998, 3119683462, 785478098, 1061096975, 2814024602, 972289411, 2683930126, 1899345369, 666184941],
            n = 3328912597,
            deeIDAdd = '';
        
        let rawjson = {"V": ["1208764165645040182224943819745543292068505102118384233786909605222173517166965027966399898837202972011306925059319478493207660788249143504507596665118352", "5839149668558060496962867049532664413652522115149421260454505207054512824359138053835485266810220318474858013908806037318701845405605227309752674060922060", "3326428129486983790026338141753694401629575105527478109999272015134808108235655246137296490573057973643243590788678743216938673761359973396919818910780649", "6754199938386634973073870506191961834996866885360287715587445916435172634423614675186086034984499705407639535727868760421495059752978834952552589050243096", "11201072696486391663281645829057087819404065227115726106675908002385967590065908470321063362366450378219446913886781837017919628642309705074305446228755085"], "S": ["80135299677971607981017462282520395945957710346977250010299310756533356290288952209455582885471197762146764397271322938027865825493059534327860703829274", "566338263885052320418426535439315074380584682359650016975159153611712154355325912581642420199646613210782481657881048004575689354639781573304428068067928", "297546800635991104156255947958437006980895086403723525501852744578225014902048965983126468105692137780975953472816850518322957954525680451223641079542544", "2630506002751381817879279461960583484625558000377881259046406134811550166007498886401048753721719103898589581006167966744806062367401096814290322816295976", "3878541800722057491399654913560373094996614414850486920732459616412748523821708655332308426116657147768839898246294769976603778347104049675009663404235994"], "J": ["2446850610723038229536932104765934805062713713117225700660317108831942100484089819762912914182387402620885669631185434429023187896837746979850158406925126", "6434104515688037086836143062128922814298907166488061978736201938400504492965333310801976443676698210324807305920220544687199083939340665897759428915654637", "5996465242394135433544669711875823252002004599831795644707377839511766999761116357594438142482779548386923770635216607466119175100663604137920588433968501", "5044592989764717060771107662237744128262611146057126802256547792953973009876693896503515446972047394749330603620199176721482735775911587107960796196381363", "3696203407293686400388803852830219034780463220838317387341557380778899751072487427448629500444079437697919679063789355735779306556385922145508756774633541"], "n": "11388433062182984096475268192683646643730265742865816209621138569900375035377207066578267778683344712881054204110128842695419772387166251801767017723337153", "Iraw": {"name": "Sirvan", "surname": "Almasi", "dateofbirth": "2427439", "deeidcontractaddress": "deeid9237492", "submit": ""}, "I": ["[", "'", "S", "i", "r", "v", "a", "n", "'", ",", " ", "'", "A", "l", "m", "a", "s", "i", "'", ",", " ", "'", "2", "4", "2", "7", "4", "3", "9", "'", ",", " ", "'", "d", "e", "e", "i", "d", "9", "2", "3", "7", "4", "9", "2", "'", ",", " ", "'", "4", "b", "2", "3", "4", "2", "5", "c", "-", "5", "e", "4", "5", "-", "4", "1", "0", "f", "-", "a", "3", "e", "0", "-", "7", "9", "6", "2", "8", "7", "0", "5", "e", "f", "5", "3", "'", "]"]}
        
        var v = rawjson.V,
            s = (rawjson.S).map(BigInt),
            I = rawjson.I,
            j = rawjson.J,
            n = rawjson.n;

        var rndStatus = {'round' : 1, 'status' : false, 'fails' : 0},
            e = [],
            rnds = 10;
        


        ws.onopen = () => {
            console.log('Opened websocket');

            // Step 0: Initiate Proof with WebServer
            if(this.stepCheck < 0) {
                let inj = {'I': I, 'j' : j, 'n' : n},
                	innit = JSON.stringify(this.jsonPayload(forID, 1, 0, inj));
                this.stepCheck = 0
                this.sendCheck(innit, ws);
            }
        };
        
        ws.onmessage = (event) => {
            let dataJSON = JSON.parse(event.data);
            this.shouldSend = true;

            if (dataJSON['round'] != rndStatus['round'] && rndStatus['status'] == true) {
                // We have a new round
                newRound = true;
                rndStatus['round'] += 1;
                rndStatus['status'] = false;
            } else {
                newRound = false;
            }
            /* ===================================
            Step 1: random r
            =================================== */
            if (dataJSON['step'] == 1 && ( this.stepCheck < 1 || this.stepCheck > 4)) {
                // Get num of rounds
                rnds = dataJSON['rnds'];
                /* Let JAVA module create random int for us and
                calculate the x = r^2 mod n, where r in [0, n)
                */
                FfsComp.computeX(n.toString(), 512,
                    (err) => {console.log(err)},
                    (msg) => {this.sendX(msg, forID, ws, rndStatus['round'])});

                this.stepCheck = 1;

            /* ===================================
            Step 2: Server sends random bit vector
            =================================== */
            } else if (dataJSON['step'] == 2 && this.stepCheck < 2) {
                e = dataJSON['data'];
                console.log('e: ' + e)
            /* ===================================
            Step 3: Send y
            =================================== */
                FfsComp.computeY(e, n.toString(), this.r, s.map(String),
                    (err) => {console.log(err)},
                    (msg) => {this.sendY(msg, forID, ws, data['round'], 3)});

                this.stepCheck = 2; // Skipping step 3 implementation
            /* ===================================
            Step 4: Get confirmation
            =================================== */
            } else if(dataJSON['step'] == 4 && this.stepCheck < 4) {
                if (dataJSON['data']=='Fail') rndStatus['fails'] += 1;
                console.log('Result: ' + dataJSON['data']);
                // Begin again
                if (rndStatus['round'] < rnds) {
                    let innit = JSON.stringify(this.jsonPayload(forID, rndStatus['round']+1, 0, ""));
                    this.sendCheck(innit, ws);
                    rndStatus['round'] +=1;
                } else {
                    console.log('The End');
                    console.log('Fails: ' + rndStatus['fails'] + '/' + rndStatus['round']);
                    ws.close();
                    if (rndStatus['fails'] > 0) {
                        this.status = "Fail";
                    } else {
                        this.status = "Pass";
                    }
                }
                this.stepCheck = 5;
            } else {
                console.log('Error');
            }
        }; // on msg
    }// submitFunction
}