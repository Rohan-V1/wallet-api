import express from "express";
import {createTransactions, deleteTransactions, getSummaryByUserId, getTransactionsByUserId} from '../controller/transactionsController.js'

const router=express.Router();

router.post("/", createTransactions)

router.get("/:userId",getTransactionsByUserId)

router.delete("/:Id",deleteTransactions)

router.get("/summary/:userId",getSummaryByUserId)

export default router;