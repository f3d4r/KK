namespace ModelLib.Tests;

public class PhoneNumberTests
{
    [Fact]
    public void Cannot_get_empty_number()
    {
        Assert.Throws<ArgumentException>(() => new PhoneNumber(""));
    }

    [Fact]
    public void Cannot_process_invalid_number()
    {
        Assert.Throws<FormatException>(() => new PhoneNumber("1234x21312x"));
        Assert.Throws<FormatException>(() => new PhoneNumber("abc"));
        Assert.Throws<FormatException>(() => new PhoneNumber("x1234x21312x"));
        Assert.Throws<FormatException>(() => new PhoneNumber("1234asdg21312"));
        Assert.Throws<FormatException>(() => new PhoneNumber("1234x"));
        Assert.Throws<FormatException>(() => new PhoneNumber("x1234"));
        Assert.Throws<FormatException>(() => new PhoneNumber("++1234"));
    }

    [Theory]
    [MemberData(nameof(MainNumberTestData))]

    public void Can_get_main_number(PhoneNumber number, string expected)
    {
        Assert.Equal(expected, number.Number);
    }

    public static TheoryData<PhoneNumber, string> MainNumberTestData()
    {
        return new TheoryData<PhoneNumber, string>
        {
            { new PhoneNumber("532462536"), "+532462536" },
            { new PhoneNumber("+532462536"), "+532462536" },
            { new PhoneNumber("532462536x21312"), "+532462536" },
            { new PhoneNumber("+532462536x21312"), "+532462536" },
        };
    }

    [Theory]
    [MemberData(nameof(ExtansionNumberTestData))]

    public void Can_get_extansion_number(PhoneNumber number, string? expected)
    {
        Assert.Equal(expected, number.Ext);
    }

    public static TheoryData<PhoneNumber, string?> ExtansionNumberTestData()
    {
        return new TheoryData<PhoneNumber, string?>
        {
            { new PhoneNumber("532462536"), null },
            { new PhoneNumber("532462536x123"), "123" },
            { new PhoneNumber("+532462536x123"), "123" },
        };
    }

    [Theory]
    [MemberData(nameof(FullNumberTestData))]

    public void Can_get_full_number(PhoneNumber number, string expected)
    {
        Assert.Equal(expected, number.ToString());
    }

    public static TheoryData<PhoneNumber, string> FullNumberTestData()
    {
        return new TheoryData<PhoneNumber, string>
        {
            { new PhoneNumber("532462536"), "+532462536" },
            { new PhoneNumber("532462536x123"), "+532462536x123" },
            { new PhoneNumber("+532462536x123"), "+532462536x123" },
        };
    }
}
