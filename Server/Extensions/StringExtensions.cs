﻿using System.Security.Cryptography;
using System.Text;

namespace Server.Extensions
{
    public static class StringExtensions
    {
        public static string ToSHA256(this string input)
        {
            using (var sha256 = SHA256.Create())
            {
                var bytes = Encoding.UTF8.GetBytes(input);
                var hashBytes = sha256.ComputeHash(bytes);
                return Convert.ToBase64String(hashBytes);
            };
        }
    }
}
