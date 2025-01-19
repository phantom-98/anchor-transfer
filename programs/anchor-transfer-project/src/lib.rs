use anchor_lang::prelude::*;

declare_id!("CVYbUAFTHnbLtnHVwvS9RCJmW4XToMpiWJf1bNk8LYuw");

#[program]
pub mod anchor_transfer_project {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
