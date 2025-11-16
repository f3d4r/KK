using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ModelLib;

public class Contact2
{
    private readonly List<PhoneNumber> phoneNumbers = new();

    public Contact2(string firstName, string? middleName = null, string? lastName = null)
    {
        if (string.IsNullOrWhiteSpace(firstName))
        {
            throw new ArgumentException("FirstName не может быть пустым", nameof(FirstName));
        }

        FirstName = firstName;
        MiddleName = middleName;
        LastName = lastName;
    }

    public string FirstName { get; private set; }

    public string? MiddleName { get; set; }

    public string? LastName { get; set; }

    // Список номеров
    public List<PhoneNumber> PhoneNumbers => new(phoneNumbers);

    // Основной номер
    public PhoneNumber? PrimaryPhoneNumber { get; private set; }

    public void AddPhoneNumber(PhoneNumber value)
    {
        if (!phoneNumbers.Contains(value))
        {
            phoneNumbers.Add(value);
        }

        if (PrimaryPhoneNumber == null)
        {
            PrimaryPhoneNumber = value;
        }
    }

    public void RemovePhoneNumber(PhoneNumber value)
    {
        if (phoneNumbers.Contains(value))
        {
            phoneNumbers.Remove(value);
        }
        else
        {
            throw new InvalidOperationException("Такого номера нет");
        }

        if (PrimaryPhoneNumber == value)
        {
            PrimaryPhoneNumber = phoneNumbers.FirstOrDefault(); // новый первый или null
        }
    }

    public void SetPrimaryPhoneNumber(PhoneNumber value)
    {
        if (!phoneNumbers.Contains(value))
        {
            throw new InvalidOperationException("Такого номера нет");
        }

        if (PrimaryPhoneNumber == value)
        {
            throw new InvalidOperationException("Номер уже выбран основным");
        }

        PrimaryPhoneNumber = value;
    }

    // Метод 4 — обновить ФИО
    public void UpdateName(string firstName, string? middleName = null, string? lastName = null)
    {
        if (string.IsNullOrWhiteSpace(firstName))
        {
            throw new ArgumentException("FirstName не может быть пустым", nameof(firstName));
        }

        FirstName = firstName;
        MiddleName = middleName;
        LastName = lastName;
    }

    // Метод 5 — форматированное представление
    public string GetFullInfo()
    {
        string fullName = $"{FirstName} {MiddleName ?? ""} {LastName ?? ""}".Trim();
        string phoneInfo = PrimaryPhoneNumber != null ? $"Основной номер: {PrimaryPhoneNumber}" : "Нет основного номера";

        return $"{fullName} | {phoneInfo}";
    }
}