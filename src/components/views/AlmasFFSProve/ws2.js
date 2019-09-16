import {observable, autorun} from 'mobx';
import {inject, observer} from 'mobx-react';
import React from 'react';
import autobind from 'autobind-decorator';
import {NativeModules} from 'react-native';

// Custom JAVA module to do BigInteger computation
var FfsComp = NativeModules.FfsComps;

@inject('wallets')
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
    @observable Iglobal = ''


    constructor(props) {
        super();
        AsyncStorage.getItem('userA', (err, result) => {
            console.log(result)
            result = JSON.parse(result)
            Iglobal = result.I;
        });
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
        console.log("y:" + ryJSON.y);
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
        
        let rawjson = {"V": ["5106923969848914605122341034470464785618414551214653935463835163691393130269064870335696160355140233608344189120858332066778602955661280685621009996191580", "8389266623359793546037655379446771398425022726523944676258851856112840880380774814150354995925765651839138888255188664860573194591006472405486314940381319", "3446753538631834301053931647823184581787541764390490338214065530719591466789450265568028979080890657481365292369970777806989936655088704281472180947641026", "10457404128425897959777232350596596167375382560138375140774476715225259673940292077169823397300683277788947360880191537270751158679359153032347144388898619", "78496281411092401574437796540296745759462427777016128480410445005758073231854502400617367100172508458864861491757902316838680172874954690131201302666150"], "S": ["1257547541771580205770982957415072860853088789875134226928045649867195330666733631909835133725116807262926907752150502905886893104983278380297848539326783", "2229044688153817391749104771556935505322728130103407872743749837954632829958101268455544594015484690902255016155607484472938698864264963464274191429711648", "91466187893633345311734721169966239005601552539629691845304603382363556437367378176262464830623632137214826702194494173592330637330688361087912578442804", "1335050898269366268249424481547350008795428603061063020906888803926042703823968524302989309650677310028064453107035028904000586543357161902406905831296395", "2818902492174087238815911398804284064400334237494085099036746229187876163208526298072437859114377706654224236280885686501992834470813451243741094257878213"], "J": ["8760283247252777841979864963734200290169939694494688364258529864457592377828312439068350147947530045124717606837320303725200149155301335123834202049648776", "3111271960388795067055056469662470885398274591166702165072461776951752511969765799515900798719157501654888699189834755359325680477235062425182890908256099", "3569653183528269217035041279422685707807778034077198169342724716826571186719972057373389384675404003258978284205512362872504357538150176138481464924748904", "5155128275309011343736657041052859837743510099084945964576973027223790017690536526166603833721219490461375282197226364494201758865978208327689001365260181", "6818103932896719326041233810142550740520996147150924662907423367855942130466369900061447852842772086732352023569201094846671772113263769586192753927347604"], "n": "11388433062182984096475268192683646643730265742865816209621138569900375035377207066578267778683344712881054204110128842695419772387166251801767017723337153", "Iraw": {"name": "Justina", "surname": "Klev", "dateofbirth": "12041995", "deeidcontractaddress": "deeID234082048", "submit": ""}, "I": "['Justina', 'Klev', '12041995', 'deeID234082048', '0475e8c1-35b1-44c2-afcc-9266d1914d1d']"};
        
        var v = rawjson.V,
            s = rawjson.S,
            I = rawjson.I,
            j = rawjson.J,
            n = rawjson.n;

        var v = rawjson.V,
            s = props.wallets.list[0].almasFFS,
            I = this.Iglobal,
            j = props.wallets.list[0].other,
            n = props.wallets.list[0].mod;

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
            console.log("dataJSON:");
            console.log(dataJSON);
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