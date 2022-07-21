const express = require('express');
require('dotenv').config();

const app = express();

const port = process.env.PORT || 7500;

app.use(express.json());

app.post('/split-payments/compute', async (req, res) => {
   let { ID, Amount, Currency, CustomerEmail, SplitInfo } = req.body;

   
    // Declare global scope variables
    let NewBalance;
    let SplitBreakdown = [];
    let TotalRatio = 0;
    
    // Calculation for FLAT
    await SplitInfo.forEach((el) => {
        let item = {};

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

    });
    
   
    // Calculation for PERCENTAGE
    await SplitInfo.forEach( el => {
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

    // Filter SplitType of RATIO
    let RatioFields = SplitInfo.filter(item => {

        return item.SplitType === 'RATIO';
        
    });

    // Calculate the total ratio in the payload
    RatioFields.forEach( el => {
        TotalRatio = TotalRatio + el.SplitValue;
    });

    // console.log(TotalRatio);

    // Calculation for RATIOS
    await RatioFields.forEach((el, index) => {
        let item = {};
        let SplitAmount = (el.SplitValue / TotalRatio) * Amount;

        // Start subtracting the SplitAmount from the Amount used in calculation
        if (index = 0) {
            NewBalance = Amount - SplitAmount;
        }
        NewBalance = NewBalance - SplitAmount;

        item.SplitEntityId = el.SplitEntityId;
        item.Amount = SplitAmount;

        SplitBreakdown.push(item);

    });
    

    // console.log(SplitBreakdown);

    res.status(200).json({
       ID,
       Balance: NewBalance,
       SplitBreakdown
    });

});

app.get('/', async (req, res) => {
    // return "<h1> Hello World</h1>";
    await res.send("<h1> Hello World</h1>");

    // res.status(200).json({
    //     status: 'success',
    //     message: 'Welcome to the API'
    // });

});

app.listen(port, () => {
    console.log(`App running on port ${port}`);
});