using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ModelLib.Tests;

public class Contact2Tests
{
    [Fact]
    public void Cannot_get_empty_first_name()
    {
        Assert.Throws<ArgumentException>(() => new Contact(""));
    }

    [Fact]
    public void Can_get_full_name()
    {
        Contact2 contact = new Contact2("Ivan");
        Contact2 contact1 = new Contact2("Petya", "Aleksandrovich", "Ivanov");

        Assert.Equal("Ivan", contact.FirstName);
        Assert.Null(contact.MiddleName);
        Assert.Null(contact.LastName);

        Assert.Equal("Aleksandrovich", contact1.MiddleName);
        Assert.Equal("Ivanov", contact1.LastName);
    }

    [Fact]
    public void Can_get_list_of_numbers()
    {
        Contact2 contact = new Contact2("Petya");
        PhoneNumber p1 = new PhoneNumber("+123456789x100");
        PhoneNumber p2 = new PhoneNumber("79991231234");

        contact.AddPhoneNumber(p1);
        contact.AddPhoneNumber(p2);

        List<PhoneNumber> numbers = contact.PhoneNumbers;

        Assert.Equal(2, numbers.Count);
        Assert.Contains(p1, numbers);
        Assert.Contains(p2, numbers);
    }

    [Fact]
    public void Can_get_primary_number()
    {
        Contact2 contact1 = new Contact2("Petya");
        PhoneNumber p1 = new PhoneNumber("+123456789x100");
        PhoneNumber p2 = new PhoneNumber("79991231234");

        Contact2 contact2 = new Contact2("Ivan");

        contact1.AddPhoneNumber(p1);
        contact1.AddPhoneNumber(p2);

        Assert.Equal("+123456789", contact1.PrimaryPhoneNumber?.Number);

        Assert.Null(contact2.PrimaryPhoneNumber?.Number);
    }

    [Fact]
    public void Can_remove_number()
    {
        Contact2 contact = new Contact2("Petya");
        PhoneNumber p1 = new PhoneNumber("+123456789x100");
        PhoneNumber p2 = new PhoneNumber("79991231234");

        contact.AddPhoneNumber(p1);
        contact.AddPhoneNumber(p2);

        contact.RemovePhoneNumber(p1);

        Assert.Single(contact.PhoneNumbers);
        Assert.Equal("+79991231234", contact.PrimaryPhoneNumber?.Number); // проверка на автозамену основного номера
    }

    [Fact]
    public void Cannot_remove_non_existant_number()
    {
        Contact2 contact = new Contact2("Petya");
        PhoneNumber p1 = new PhoneNumber("+123456789x100");
        PhoneNumber p2 = new PhoneNumber("79991231234");

        contact.AddPhoneNumber(p1);

        Assert.Throws<InvalidOperationException>(() => contact.RemovePhoneNumber(p2));
    }

    [Fact]
    public void Can_set_primary_number()
    {
        Contact2 contact = new Contact2("Petya");
        PhoneNumber p1 = new PhoneNumber("79991231234");
        PhoneNumber p2 = new PhoneNumber("+123456789x100");

        contact.AddPhoneNumber(p1);
        contact.AddPhoneNumber(p2);

        contact.SetPrimaryPhoneNumber(p2);
        Assert.Equal("+123456789", contact.PrimaryPhoneNumber?.Number);
    }

    [Fact]
    public void Cannot_set_primary_number()
    {
        Contact2 contact = new Contact2("Petya");
        PhoneNumber p1 = new PhoneNumber("79991231234");
        PhoneNumber p2 = new PhoneNumber("+123456789x100");
        PhoneNumber p3 = new PhoneNumber("+999999999");

        contact.AddPhoneNumber(p1);
        contact.AddPhoneNumber(p2);

        Assert.Throws<InvalidOperationException>(() => contact.SetPrimaryPhoneNumber(p1)); // уже выбран основным
        Assert.Throws<InvalidOperationException>(() => contact.SetPrimaryPhoneNumber(p3)); // не существует
    }

    [Fact]
    public void Can_update_name()
    {
        Contact2 contact = new Contact2("Petya", "Aleksandrovich", "Ivanov");
        contact.UpdateName("Ivan", "Petrovich", "Ivanov");

        Assert.Equal("Ivan", contact.FirstName);
        Assert.Equal("Petrovich", contact.MiddleName);
        Assert.Equal("Ivanov", contact.LastName);
    }

    [Fact]
    public void Cannot_update_name()
    {
        Contact2 contact1 = new Contact2("Petya", "Aleksandrovich", "Ivanov");

        Assert.Throws<ArgumentException>(() => contact1.UpdateName("", "Petrovich", "Ivanov"));
    }

    [Fact]
    public void Can_get_full_info()
    {
        Contact2 contact = new Contact2("Petya", "Aleksandrovich", "Ivanov");
        Contact2 contact2 = new Contact2("Petya");
        PhoneNumber p1 = new PhoneNumber("79991231234");
        contact.AddPhoneNumber(p1);

        Assert.Equal("Petya Aleksandrovich Ivanov | Основной номер: +79991231234", contact.GetFullInfo());
        Assert.Equal("Petya | Нет основного номера", contact2.GetFullInfo());
    }
}