import { sql } from "../config/db.js";

export async function getTransactionsByUserId(req,res) {
        try {
            const {userId}=req.params;
             console.log(userId);
    
            const transactions= await sql` SELECT * FROM transactions WHERE user_id=${userId} ORDER BY created_at DESC`;
    
            res.status(200).json(transactions);
            
        } catch (error) {
            console.log("error getting the transactions ",error);   
            res.status(500).json({message:"Internal error"})
        }  
}

export async function createTransactions(req,res) {
    try {
        const {title,amount,category,user_id}=req.body;

        if(!title||amount==undefined||!category||!user_id){
            return res.status(400).json({message:"All fields are required"});
        }

        const transactions = await sql`
            INSERT INTO transactions(user_id,title,amount,category)
            VALUES(${user_id},${title},${amount},${category})
            RETURNING *
        `


        console.log(transactions)
        res.status(201).json(transactions[0])

    } catch (error) {
     console.log("error creating the transaction",error);   
     res.status(500).json({message:"Internal error"})
    }

}

export async function deleteTransactions(req,res) {
        try {
            const {Id}=req.params;
            if(isNaN(parseInt(Id))){
                return res.status(400).json({message:"Given  ID is not a number"})
            }
            const transaction = await sql`DELETE  FROM transactions WHERE id=${Id} RETURNING *`
            if(transaction.length===0){
                return res.status(404).json({message:"ID not found"});
            }
            res.status(200).json( {message: "Transaction deleted successfully"})
        } catch (error) {
            console.log("error deleting the transaction",error);   
            res.status(500).json({message:"Internal error"})
        }
    
}

export async function getSummaryByUserId(req,res) {
    try {
        const {userId}= req.params;

        const balanceResult= await sql `
            SELECT COALESCE(SUM(amount),0) as balance FROM transactions WHERE user_id=${userId}
        `;

        const incomeResult= await sql `
            SELECT COALESCE(SUM(amount),0) as income FROM transactions WHERE user_id=${userId} AND amount>0
        `;
        const expenseResult= await sql `
            SELECT COALESCE(SUM(amount),0) as expense FROM transactions WHERE user_id=${userId} AND amount<0
        `;
        res.status(200).json({
            balance: balanceResult[0].balance,
            income: incomeResult[0].income,
            expense: expenseResult[0].expense
        })
    } catch (error) {
        console.log("error creating the transaction",error);   
        res.status(500).json({message:"Internal error"})
    }
}