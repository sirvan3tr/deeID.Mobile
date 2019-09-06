package com.deeid;
 
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.uimanager.IllegalViewOperationException;
import java.util.ArrayList;
import java.util.List;
import java.math.BigInteger;
import java.security.SecureRandom;
import java.util.Random;
 
public class FfsCompsModule extends ReactContextBaseJavaModule {
 
    public FfsCompsModule(ReactApplicationContext reactContext) {
        super(reactContext); //required by React Native
    }
 
    @Override
    //getName is required to define the name of the module represented in JavaScript
    public String getName() { 
        return "FfsComps";
    }
 
    @ReactMethod
    public void sayHi(Callback errorCallback, Callback successCallback) {
        try {
            System.out.println("Greetings from Java");
            successCallback.invoke("Callback : Greetings from Java");
        } catch (IllegalViewOperationException e) {
            errorCallback.invoke(e.getMessage());
        }
    }


    /*
        Generate a random r that=> r in [0, n)
    */
    @ReactMethod
    public void computeX(String nRaw, int nLength, Callback errorCallback,
        Callback successCallback) {
        try {
            BigInteger n = new BigInteger(nRaw);
            int comparevalue = 0;
            BigInteger r, x;

            while(comparevalue==0) {
                // 1. Calculate the length of the random number
                Random randLength = new SecureRandom();
                int lengthRandNum = randLength.nextInt(nLength);

                // 2. Create the random big integer
                Random rand = new SecureRandom();
                r = new BigInteger(lengthRandNum, rand);

                // 3. Ensure r does not equal to n
                comparevalue = r.compareTo(n);
                if(comparevalue!=0) {
                    x = (r.pow(2)).mod(n);
                    // Because of big int, pass the info as string in a json
                    successCallback.invoke("{'r':'"+r.toString()+"','x':'"+x.toString()+"'}");
                }
            }
        } catch (IllegalViewOperationException e) {
            errorCallback.invoke(e.getMessage());
        }
    }


    /*
        Compute y
    */
    @ReactMethod
    public void computeY(ReadableArray eRaw, String nRaw, String rRaw, ReadableArray sRaw,
        Callback errorCallback, Callback successCallback) {
        try {
            BigInteger n = new BigInteger(nRaw);
            BigInteger r = new BigInteger(rRaw);
            BigInteger y = new BigInteger(rRaw);

            //List<Integer> ee = new ArrayList<>();
            //ee = eRaw.toArrayList();

            BigInteger s;

            for(int i=0; i < sRaw.size();i++) {
                if(eRaw.getInt(i)==1) {
                    s = new BigInteger(sRaw.getString(i));
                    y = y.multiply(s);
                }
            }
            
            y = y.mod(n);
            successCallback.invoke("{'r':'"+r.toString()+"','y':'"+y.toString()+"'}");
        } catch (IllegalViewOperationException e) {
            errorCallback.invoke(e.getMessage());
        }
    }
}