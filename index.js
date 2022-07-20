const express = require('express');

const app = express();

const port = 7500;

app.use(express.json());

app.post('/split-payments/compute', (req, res) => {
   let { ID, Amount, Currency, CustomerEmail, SplitInfo } = req.body;
//    let InitialBalance = Amount;

    // console.log(req.body);
    // console.log(SplitInfo);
    // console.log(SplitInfo[0]);

    let NewBalance;
    let SplitBreakdown = [];
    // let item = {};
    
    SplitInfo.forEach((el) => {
        let item = {};
        // let NewBalance;

        if (el.SplitType === 'FLAT') {
            let SplitAmount = el.SplitValue;
            NewBalance = Amount - SplitAmount;

            item.SplitEntityId = el.SplitEntityId;
            item.Amount = SplitAmount;

            // console.log(NewBalance);
            Amount = NewBalance;

            // console.log(item);
            SplitBreakdown.push(item);
        }

        // console.log(NewBalance);
        
        // if (el.SplitType === 'RATIO') {
        //     let OpeningRatioBalance = Amount;
        //     totalRatio = 
        // }
    });
    
    // console.log(NewBalance);
    // console.log(Amount);

    SplitInfo.forEach( el => {
        let item = {};

        if (el.SplitType === 'PERCENTAGE') {
            let SplitAmount = (el.SplitValue * Amount) / 100
            NewBalance = Amount - SplitAmount;

            item.SplitEntityId = el.SplitEntityId;
            item.Amount = SplitAmount;

            Amount = NewBalance;

            SplitBreakdown.push(item);
        }
    });

    SplitInfo.forEach( el => {
        let item = {};
        let SplitRatio = 0;

        if (el.SplitType === 'RATIO') {
            
            SplitRatio = SplitRatio + el.SplitValue;
            console.log(SplitRatio);
            // console.log(el.SplitValue);
        }
        // console.log(SplitRatio);

    })

    console.log(SplitBreakdown);


    res.status(200).json({
       ID,
       Balance: NewBalance,
       SplitBreakdown
    });

});

app.listen(port, () => {
    console.log(`App running on port ${port}`);
});