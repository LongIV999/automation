import asyncio
import httpx
from mcp.server.fastmcp import FastMCP

import os

# Initialize FastMCP server
mcp = FastMCP("n8n-workflows")

# Config
N8N_BASE_URL = os.getenv("N8N_BASE_URL", "https://longbest.ai5phut.com")
N8N_API_KEY = os.getenv("N8N_API_KEY")

@mcp.tool()
async def analyze_ai_news(article_url: str, target_audience: str = "office_workers"):
    """
    Analyze AI news article for viral potential in Vietnamese market.
    Returns viral score (1-10), key talking points, and content angles.
    """
    workflow_id = "ai-news-analyzer" # This should match your n8n webhook path
    
    async with httpx.AsyncClient() as client:
        response = await client.post(
            f"{N8N_BASE_URL}/webhook/{workflow_id}",
            json={
                "article_url": article_url,
                "target_audience": target_audience
            },
            headers={"X-N8N-API-KEY": N8N_API_KEY}
        )
        response.raise_for_status()
        return response.json()

@mcp.tool()
async def generate_tiktok_script(article_summary: str, viral_score: int):
    """
    Generate TikTok video script (60s) from article summary.
    Returns hook, body, CTA, and B-roll suggestions.
    """
    workflow_id = "tiktok-script-generator" # This should match your n8n webhook path
    
    async with httpx.AsyncClient() as client:
        response = await client.post(
            f"{N8N_BASE_URL}/webhook/{workflow_id}",
            json={
                "article_summary": article_summary,
                "viral_score": viral_score
            },
            headers={"X-N8N-API-KEY": N8N_API_KEY}
        )
        response.raise_for_status()
        return response.json()

if __name__ == "__main__":
    mcp.run()
