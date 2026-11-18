package com.example.ebank_service.controllers;

import com.example.ebank_service.entities.BankAccount;
import com.example.ebank_service.repositories.BankAccountRepository;
import com.example.ebank_service.services.BankAccountService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class BankAccountRestController {

    private BankAccountService bankAccountService;

    public BankAccountRestController(BankAccountService bankAccountService){
        this.bankAccountService = bankAccountService;
    }

    @GetMapping("bankaccounts")
    public List<BankAccount> getAllBankAccounts(){
        return bankAccountService.getAllBankAccounts();
    }

    @GetMapping("/bankaccounts/{id}")
    public BankAccount getBankAccountById(@PathVariable String id){
        return bankAccountService.getBankAccountById(id);
    }
    @PostMapping("bankaccounts")
    public BankAccount save(@RequestBody BankAccount bankAccount){
        return bankAccountService.save(bankAccount);
    }
}
