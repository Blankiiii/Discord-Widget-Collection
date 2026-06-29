using System;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;

class Program
{
    private string? botToken;
    private string? applicationId;
    private string? userId;
    private string? JSONString;

    private (string BotToken, string ApplicationId, string UserId, string JSONString) GetInput()
    {
        Console.WriteLine();
        Console.WriteLine();
        Console.WriteLine("Put your Discord Bot token here:");
        botToken = Console.ReadLine();

        Console.WriteLine("Put your Application ID here:");
        applicationId = Console.ReadLine();

        Console.WriteLine("Put your Discord User ID here:");
        userId = Console.ReadLine();

        Console.WriteLine("Put your JSON String here (only formatted):");
        JSONString = Console.ReadLine();
        

        if (string.IsNullOrWhiteSpace(botToken) ||
            string.IsNullOrWhiteSpace(applicationId) ||
            string.IsNullOrWhiteSpace(userId) ||
            string.IsNullOrWhiteSpace(JSONString))
        {
            throw new InvalidOperationException("All values are required.");
        }

        return (botToken, applicationId, userId, JSONString);
    }

    static void Main(string[] args)
    {
        Console.WriteLine("----- Widget sync Quick fix made by Blank with love -----");

        var program = new Program();
        var (botToken, applicationId, userId, jsonString) = program.GetInput();

        syncDiscordWidget(botToken, applicationId, userId, jsonString);

        Console.WriteLine();
        Console.WriteLine("Press any key to exit...");
        Console.ReadKey();
    }

    private static void syncDiscordWidget(string BotToken, string ApplicationId, string UserID, string JSONString)
    {
        try
        {
            using var client = new HttpClient();
            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bot", BotToken);
            client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

            var requestUri = $"https://discord.com/api/v10/applications/{ApplicationId}/users/{UserID}/identities/0/profile";
            using var content = new StringContent(JSONString, Encoding.UTF8, "application/json");

            using var response = client.PatchAsync(requestUri, content).GetAwaiter().GetResult();
            var responseBody = response.Content.ReadAsStringAsync().GetAwaiter().GetResult();

            if (response.IsSuccessStatusCode)
            {
                Console.WriteLine("Discord widget updated successfully.");
                
            }
            else
            {
                Console.WriteLine($"Discord API Error: {(int)response.StatusCode} {response.ReasonPhrase}");
                Console.WriteLine(responseBody);
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error: {ex.Message}");
        }
    }
}