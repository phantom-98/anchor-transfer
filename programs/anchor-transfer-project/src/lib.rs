use anchor_lang::prelude::*;

use anchor_spl::token_interface::{Mint, TokenAccount, TokenInterface, TransferChecked, transfer_checked};

declare_id!("CqNc5xHcA9HLQAMEyWKudapC6Comf1PksQRJJVrjPNbL");

#[program]
pub mod anchor_transfer_project {
    use super::*;

    pub fn transfer_spl_tokens(ctx: Context<TransferSpl>, amount: u64) -> Result<()> {
        let destination = &ctx.accounts.to_ata;
        let source = &ctx.accounts.from_ata;
        let token_program = &ctx.accounts.token_program;
        let mint = &ctx.accounts.mint;
        let authority = &ctx.accounts.from;

        let accounts = TransferChecked {
            from: source.to_account_info(),
            to: destination.to_account_info(),
            authority: authority.to_account_info(),
            mint: mint.to_account_info(),
        };
        let ctx = CpiContext::new(
            token_program.to_account_info(),
            accounts
        );
        transfer_checked(ctx, amount, mint.decimals);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct TransferSpl<'info> {
    pub from: Signer<'info>,
    #[account(mut)]
    pub from_ata: InterfaceAccount<'info, TokenAccount>,
    #[account(mut)]
    pub to_ata: InterfaceAccount<'info, TokenAccount>,
    #[account(mut)]
    pub mint: InterfaceAccount<'info, Mint>,
    pub token_program: Interface<'info, TokenInterface>,
}