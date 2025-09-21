package utils

import (
	"context"
	"fmt"
	"os"

	"github.com/google/generative-ai-go/genai"
	"google.golang.org/api/option"
)

var aiClient *genai.Client

func InitAI() {
	ctx := context.Background()
	apiKey := os.Getenv("GEMINI_API_KEY")
	if apiKey == "" {
		panic("GEMINI_API_KEY not set")
	}

	client, err := genai.NewClient(ctx, option.WithAPIKey(apiKey))
	if err != nil {
		panic(err)
	}
	aiClient = client
}
func GenerateDescription(title string) (string, error) {
	ctx := context.Background()
	model := aiClient.GenerativeModel("gemini-1.5-flash")

	prompt := fmt.Sprintf(
		"Buat deskripsi singkat dan relevan untuk todo dengan judul: \"%s\". Jangan kasih pertanyaan balik, cukup 1-2 kalimat jelas dan juga kasih emoji supara interaktif.",
		title,
	)

	resp, err := model.GenerateContent(ctx, genai.Text(prompt))
	if err != nil {
		return "", err
	}

	if len(resp.Candidates) == 0 {
		return "", fmt.Errorf("no response from AI")
	}

	var result string
	for _, part := range resp.Candidates[0].Content.Parts {
		if txt, ok := part.(genai.Text); ok {
			result += string(txt)
		}
	}

	return result, nil
}
