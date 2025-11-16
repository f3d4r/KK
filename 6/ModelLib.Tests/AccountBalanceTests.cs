namespace ModelLib.Tests;

public class AccountBalanceTests
{
    [Fact]
    public void Can_spend_some_initial_bonuses()
    {
        AccountBalance balance = new(bonuses: 750.00m);

        balance.Withdraw(600.00m);

        Assert.Equal(0.00m, balance.Funds);
        Assert.Equal(150.00m, balance.Bonuses);
        Assert.Equal(0.00m, balance.CurrentOverdraft);
        Assert.Equal(0.00m, balance.MaxOverdraft);
    }

    [Fact]
    public void Can_spend_all_initial_bonuses()
    {
        AccountBalance balance = new(bonuses: 1000.00m);

        balance.Withdraw(1000.00m);

        Assert.Equal(0.00m, balance.Funds);
        Assert.Equal(0.00m, balance.Bonuses);
        Assert.Equal(0.00m, balance.CurrentOverdraft);
        Assert.Equal(0.00m, balance.MaxOverdraft);
    }

    [Fact]
    public void Cannot_spend_more_than_initial_bonuses()
    {
        AccountBalance balance = new(bonuses: 999.00m);

        Assert.Throws<InvalidOperationException>(() => balance.Withdraw(1000.00m));
    }

    [Fact]
    public void Can_spend_bonuses_after_adding_funds()
    {
        AccountBalance balance = new(bonuses: 999.00m);
        balance.AddFunds(500.00m);

        balance.Withdraw(1000.00m);

        Assert.Equal(499.00m, balance.Funds);
        Assert.Equal(0.00m, balance.Bonuses);
        Assert.Equal(0.00m, balance.CurrentOverdraft);
        Assert.Equal(0.00m, balance.MaxOverdraft);
    }

    [Fact]
    public void Spending_bonuses_and_funds_does_not_change_overdraft()
    {
        AccountBalance balance = new(bonuses: 999.00m, maxOverdraft: 100.00m);
        balance.AddFunds(500.00m);

        balance.Withdraw(1000.00m);

        Assert.Equal(499.00m, balance.Funds);
        Assert.Equal(0.00m, balance.Bonuses);
        Assert.Equal(0.00m, balance.CurrentOverdraft);
        Assert.Equal(100.00m, balance.MaxOverdraft);
    }

    [Fact]
    public void Can_use_overdraft_when_all_bonuses_spent()
    {
        AccountBalance balance = new(bonuses: 200.00m, maxOverdraft: 100.00m);

        balance.Withdraw(250.00m);

        Assert.Equal(0.00m, balance.Funds);
        Assert.Equal(0.00m, balance.Bonuses);
        Assert.Equal(50.00m, balance.CurrentOverdraft);
        Assert.Equal(100.00m, balance.MaxOverdraft);
    }

    [Fact]
    public void Can_add_funds_to_close_overdraft()
    {
        AccountBalance balance = new(bonuses: 200.00m, maxOverdraft: 100.00m);
        balance.Withdraw(250.00m);

        balance.AddFunds(100.00m);

        Assert.Equal(50.00m, balance.Funds);
        Assert.Equal(0.00m, balance.Bonuses);
        Assert.Equal(0.00m, balance.CurrentOverdraft);
        Assert.Equal(100.00m, balance.MaxOverdraft);
    }

    [Fact]
    public void Can_add_bonuses_and_spend_them_before_funds()
    {
        AccountBalance balance = new(bonuses: 200.00m);

        balance.AddFunds(150.00m);
        balance.Withdraw(250.00m);

        balance.AddBonuses(100.00m);
        balance.Withdraw(80.00m);

        Assert.Equal(100.00m, balance.Funds);
        Assert.Equal(20.00m, balance.Bonuses);
        Assert.Equal(0.00m, balance.CurrentOverdraft);
        Assert.Equal(0.00m, balance.MaxOverdraft);
    }

    [Fact]
    public void Added_bonuses_do_not_affect_overdraft()
    {
        AccountBalance balance = new(bonuses: 200.00m, maxOverdraft: 100.00m);
        balance.Withdraw(250.00m);

        balance.AddBonuses(100.00m);

        Assert.Equal(0.00m, balance.Funds);
        Assert.Equal(100.00m, balance.Bonuses);
        Assert.Equal(50.00m, balance.CurrentOverdraft);
        Assert.Equal(100.00m, balance.MaxOverdraft);
    }

    [Fact]
    public void Cannot_add_negative_funds()
    {
        AccountBalance balance = new(bonuses: 200.00m, maxOverdraft: 100.00m);

        Assert.Throws<ArgumentOutOfRangeException>(() => balance.AddFunds(-50.00m));
    }

    [Fact]
    public void Cannot_add_negative_bonuses()
    {
        AccountBalance balance = new(bonuses: 200.00m, maxOverdraft: 100.00m);

        Assert.Throws<ArgumentOutOfRangeException>(() => balance.AddBonuses(-50.00m));
    }

    [Fact]
    public void Cannot_withdraw_negative_amount()
    {
        AccountBalance balance = new(bonuses: 200.00m, maxOverdraft: 100.00m);

        Assert.Throws<ArgumentOutOfRangeException>(() => balance.Withdraw(-50.00m));
    }
}