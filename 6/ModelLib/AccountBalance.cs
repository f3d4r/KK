namespace ModelLib;

/// <summary>
///  Аккаунт пользователя для тарификации его подписок.
/// </summary>
public class AccountBalance
{
    public AccountBalance(decimal bonuses = 0, decimal maxOverdraft = 0)
    {
        if (bonuses < 0)
        {
            throw new ArgumentOutOfRangeException(nameof(maxOverdraft), "Bonuses amount cannot be negative");
        }

        if (maxOverdraft < 0)
        {
            throw new ArgumentOutOfRangeException(nameof(maxOverdraft), "Maximum overdraft cannot be negative");
        }

        Funds = 0;
        Bonuses = bonuses;
        CurrentOverdraft = 0;
        MaxOverdraft = maxOverdraft;
    }

    /// <summary>
    ///  Основные средства в аккаунте пользователя (остаток денег).
    /// </summary>
    public decimal Funds { get; private set; }

    /// <summary>
    ///  Бонусный баланс аккаунта пользователя (бонусы начисляются системой и тратятся вперёд основных средств)
    /// </summary>
    public decimal Bonuses { get; private set; }

    /// <summary>
    ///  Текущий овердрафт аккаунта пользователя, то есть количество денег,
    ///   потраченное в долг при отсутствии основных средств.
    /// </summary>
    public decimal CurrentOverdraft { get; private set; }

    /// <summary>
    ///  Максимальный овердрафт аккаунта пользователя, то есть максимальное количество денег,
    ///   которое он может потратить в долг при отсутствии основных средств.
    /// </summary>
    public decimal MaxOverdraft { get; private set; }

    /// <summary>
    ///   Пополняет баланс указанной суммой
    /// </summary>
    public void AddFunds(decimal amount)
    {
        if (amount < 0)
        {
            throw new ArgumentOutOfRangeException(nameof(amount), "Added funds must be positive");
        }

        // Сначала убираем overdraft
        decimal closedOverdraft = Math.Min(CurrentOverdraft, amount);
        decimal addedFunds = amount - closedOverdraft;

        CurrentOverdraft -= closedOverdraft;
        Funds += addedFunds;
    }

    public void AddBonuses(decimal amount)
    {
        if (amount < 0)
        {
            throw new ArgumentOutOfRangeException(nameof(amount), "Added bonuses must be positive");
        }

        Bonuses += amount;
    }

    public void Withdraw(decimal amount)
    {
        if (amount < 0)
        {
            throw new ArgumentOutOfRangeException(nameof(amount), "Withdrawn amount must be positive");
        }

        decimal availableAmount = Bonuses + Funds + (MaxOverdraft - CurrentOverdraft);
        if (amount > availableAmount)
        {
            throw new InvalidOperationException("Insufficient funds to withdraw");
        }

        decimal spentBonuses = Math.Min(Bonuses, amount);
        decimal spentFunds = Math.Min(Funds, amount - spentBonuses);
        decimal addedOverdraft = amount - spentBonuses - spentFunds;

        Bonuses -= spentBonuses;
        Funds -= spentFunds;
        CurrentOverdraft += addedOverdraft;
    }
}