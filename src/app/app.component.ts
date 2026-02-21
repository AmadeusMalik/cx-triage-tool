import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  private supabase: SupabaseClient = createClient(
    'https://uyfaiqliysdrgzrjybmq.supabase.co',
    'sb_publishable_VSYPxrUvcSeY0j3vaCiufw_CIZHp_gb',
  );
  // New variables for UI state
  isProcessing: boolean = false;
  showToast: boolean = false;
  // State Variables
  customerComplaint: string = '';
  refinedResponse: string = '';
  engineerTicket: string = '';

  // Non-AI Version (For Testing UI without API Calls)
  async processTicket() {
    // 1. Clean the input first
    const cleanedComplaint = this.customerComplaint.replace(/\n/g, " ").trim();

    // 2. Check if it's empty OR if we are already processing
    if (!cleanedComplaint || this.isProcessing) return;

    this.isProcessing = true;
    this.refinedResponse = 'Hold Tight! 🤖 AI is generating a response...';

    // 3. Create the Ticket using the cleaned version
    this.engineerTicket = JSON.stringify(
      {
        id: 'TKT-' + Math.floor(Math.random() * 1000),
        priority: 'P2',
        source: 'CX_DASHBOARD',
        payload: { raw_issue: cleanedComplaint }, // Cleaned version
      },
      null,
      2,
    );
    // SIMULATE API DELAY (1.5 seconds)
    await new Promise((resolve) => setTimeout(resolve, 1500));
    // Use cleanedComplaint here so the AI response is clean
    this.refinedResponse = `Hi there! I'm truly sorry to hear you're experiencing issues with "${cleanedComplaint}". I've escalated this to our engineering team...`;

    // Passing the cleaned version to the DB helper
    await this.saveToDatabase(cleanedComplaint);

    this.isProcessing = false;
    this.showToast = true;
    setTimeout(() => (this.showToast = false), 3000);
   this.customerComplaint = ''; }

  // Update saveToDatabase to accept the clean string
  async saveToDatabase(cleanData: string) {
    const { data, error } = await this.supabase.from('support_tickets').insert([
      {
        raw_complaint: cleanData, // Use the passed-in clean data
        ai_response: this.refinedResponse,
        json_payload: this.engineerTicket,
      },
    ]);

    if (error) {
      console.error('Error saving to Supabase:', error);
    } else {
      console.log('Ticket successfully synced to SQL Database!');
    }
  }
}

// AI Version (Uncomment to use with actual API calls)

// async processTicket() {
//   if (!this.customerComplaint) return;

//   // 1. Loading state
//   this.refinedResponse = "🤖 AI is generating a response...";

//   // 2. Technical Ticket
//   this.engineerTicket = JSON.stringify({
//     id: "TKT-" + Math.floor(Math.random() * 1000),
//     priority: "P2",
//     source: "CX_DASHBOARD",
//     payload: { raw_issue: this.customerComplaint }
//   }, null, 2);

//   // 3. AI API Call (Replace 'YOUR_API_KEY' with your actual OpenAI key)
//   const apiKey ='';

//   try {
//     const response = await fetch('https://api.openai.com/v1/chat/completions', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         'Authorization': `Bearer ${apiKey}`
//       },
//       body: JSON.stringify({
//         model: "gpt-3.5-turbo",
//         messages: [
//           {
//             role: "system",
//             content: "You are an empathetic technical support agent. Rewrite the user's technical complaint into a professional, de-escalated response. Apologize and assure them engineering is looking into it. Keep it under 3 sentences."
//           },
//           {
//             role: "user",
//             content: this.customerComplaint
//           }
//         ],
//         temperature: 0.7
//       })
//     });

//     const data = await response.json();

//     if (data.choices && data.choices.length > 0) {
//       this.refinedResponse = data.choices[0].message.content;
//     } else {
//       this.refinedResponse = "Error: Please check your API key or billing limit.";
//     }

//   } catch (error) {
//     console.error("AI API Error:", error);
//     this.refinedResponse = "🚨 Connection failed. Check your internet or API key.";
//   }
// }
