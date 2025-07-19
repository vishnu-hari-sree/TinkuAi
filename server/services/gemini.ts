import { GoogleGenAI } from "@google/genai";

// DON'T DELETE THIS COMMENT
// Follow these instructions when using this blueprint:
// - Note that the newest Gemini model series is "gemini-2.5-flash" or gemini-2.5-pro"
//   - do not change this unless explicitly requested by the user

// This API key is from Gemini Developer API Key, not vertex AI API Key
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function summarizeArticle(text: string): Promise<string> {
    try {
        const prompt = `You are an AI assistant specialized in student community event planning. 
        
        The user is asking: ${text}
        
        Provide helpful, practical advice for organizing student events, including:
        - Event structure and logistics
        - Timing recommendations based on student schedules
        - Budget considerations
        - Engagement strategies
        - Venue and format suggestions
        
        Keep responses concise but informative, and focus on actionable insights that campus leads can implement.`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
        });

        return response.text || "I'm here to help with event planning! Try asking me about organizing workshops, hackathons, or other student activities.";
    } catch (error) {
        console.error("Gemini API error:", error);
        return "I'm currently experiencing technical difficulties. Please try again later or contact support if the issue persists.";
    }
}

export async function generateEventSuggestions(pastEvents: any[], month: string, eventType?: string): Promise<string> {
    try {
        const eventContext = pastEvents.map(event => 
            `${event.name} (${event.programType}, ${event.participantCount} participants, rating: ${event.rating})`
        ).join(", ");

        const prompt = `Based on these past successful events: ${eventContext}
        
        Suggest 3-5 ${eventType || 'diverse'} event ideas for ${month} that would engage students. Consider:
        - Seasonal timing and student availability
        - Past event performance and ratings
        - Variety in event types and formats
        - Realistic participant expectations
        
        Format as a numbered list with brief descriptions.`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
        });

        return response.text || "Here are some general event suggestions based on successful student engagement patterns.";
    } catch (error) {
        console.error("Gemini API error:", error);
        return "I'm having trouble generating suggestions right now. Please try again later.";
    }
}

export async function analyzeEventData(events: any[]): Promise<string> {
    try {
        const eventStats = {
            totalEvents: events.length,
            avgParticipants: events.reduce((sum, e) => sum + (e.participantCount || 0), 0) / events.length,
            avgRating: events.reduce((sum, e) => sum + (e.rating || 0), 0) / events.length,
            eventTypes: events.reduce((acc, e) => {
                acc[e.programType] = (acc[e.programType] || 0) + 1;
                return acc;
            }, {} as Record<string, number>)
        };

        const prompt = `Analyze this event data and provide insights:
        
        Total Events: ${eventStats.totalEvents}
        Average Participants: ${Math.round(eventStats.avgParticipants)}
        Average Rating: ${eventStats.avgRating.toFixed(1)}/5
        Event Types: ${JSON.stringify(eventStats.eventTypes)}
        
        Provide:
        1. Key performance insights
        2. Recommendations for improvement
        3. Suggested focus areas for future events
        4. Optimal event types based on data
        
        Keep it practical and actionable for campus community leaders.`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-pro",
            contents: prompt,
        });

        return response.text || "Based on your event data, I can see opportunities for growth in student engagement.";
    } catch (error) {
        console.error("Gemini API error:", error);
        return "I'm unable to analyze the data right now. Please try again later.";
    }
}

export async function planEventStructure(eventType: string, duration: string, participantCount: number): Promise<string> {
    try {
        const prompt = `Plan a detailed structure for a ${duration} ${eventType} with approximately ${participantCount} participants.
        
        Provide:
        1. Detailed timeline and schedule
        2. Resource requirements (venue, equipment, staff)
        3. Budget estimation in INR
        4. Registration and logistics planning
        5. Risk management considerations
        
        Make it specific and actionable for student organizers.`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-pro",
            contents: prompt,
        });

        return response.text || "I can help you plan event structures. Please provide more details about your event requirements.";
    } catch (error) {
        console.error("Gemini API error:", error);
        return "I'm having trouble creating an event plan right now. Please try again later.";
    }
}
