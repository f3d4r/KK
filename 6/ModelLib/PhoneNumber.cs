using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

public class PhoneNumber
{
    public PhoneNumber(string text)
    {
        if (string.IsNullOrWhiteSpace(text))
        {
            throw new ArgumentException("Номер не может быть пустым", nameof(text));
        }

        string cleanText = Regex.Replace(text, @"[ \-\(\)]", "");

        Match match = Regex.Match(cleanText, @"^(?<num>\+?\d+)x(?<ext>\d+)$", RegexOptions.IgnoreCase);

        if (match.Success)
        {
            Number = match.Groups["num"].Value;
            Ext = match.Groups["ext"].Value;
        }
        else
        {
            Number = cleanText;
            Ext = null;
        }

        // Проверка основного номера
        if (!Regex.IsMatch(Number, @"^\+?\d+$"))
        {
            throw new FormatException("Неверный формат телефонного номера");
        }

        // Проверка добавочного только если он есть
        if (Ext != null && !Regex.IsMatch(Ext, @"^\d+$"))
        {
            throw new FormatException("Неверный формат добавочного номера");
        }

        if (!Number.StartsWith("+"))
        {
            Number = "+" + Number;
        }
    }

    public string Number { get; private set; }

    public string? Ext { get; private set; }

    public override string ToString()
    {
        if (Ext is not null)
        {
            return $"{Number}x{Ext}";
        }
        else
        {
            return Number;
        }
    }
}