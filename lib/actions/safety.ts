'use server';

import { teamDb } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { v4 as uuidv4 } from 'uuid';

export interface SafetyReportData {
  venue_name: string;
  location: string;
  incident_date: string;
  rating: number;
  description: string;
}

/**
 * Submits a new safety report.
 */
export async function submitSafetyReport(data: SafetyReportData, userId?: string) {
  const id = uuidv4();
  
  const sql = `
    INSERT INTO safety_reports (id, venue_name, location, incident_date, rating, description, user_id)
    VALUES ('${id}', '${data.venue_name}', '${data.location}', '${data.incident_date}', ${data.rating}, '${data.description}', ${userId ? `'${userId}'` : 'NULL'})
  `;

  try {
    await teamDb(sql);
    revalidatePath('/[locale]/community/safety', 'page');
    return { success: true, id };
  } catch (error) {
    console.error('Error submitting safety report:', error);
    throw new Error('Failed to submit safety report');
  }
}

/**
 * Fetches safety reports, optionally aggregated by venue.
 */
export async function getSafetyReports() {
  const sql = `
    SELECT 
      venue_name, 
      location, 
      AVG(rating) as avg_rating, 
      COUNT(*) as report_count,
      GROUP_CONCAT(description, '||') as descriptions,
      GROUP_CONCAT(created_at, '||') as dates
    FROM safety_reports 
    WHERE status = 'verified' OR status = 'pending'
    GROUP BY venue_name, location
    ORDER BY avg_rating ASC
  `;

  try {
    const results = await teamDb(sql);
    return results.map(r => ({
      ...r,
      descriptions: r.descriptions ? r.descriptions.split('||') : [],
      dates: r.dates ? r.dates.split('||') : [],
      avg_rating: parseFloat(r.avg_rating).toFixed(1)
    }));
  } catch (error) {
    console.error('Error fetching safety reports:', error);
    return [];
  }
}

/**
 * Fetches recent safety reports.
 */
export async function getRecentSafetyReports(limit = 5) {
  const sql = `
    SELECT * FROM safety_reports 
    WHERE status = 'verified' OR status = 'pending'
    ORDER BY created_at DESC 
    LIMIT ${limit}
  `;

  try {
    return await teamDb(sql);
  } catch (error) {
    console.error('Error fetching recent safety reports:', error);
    return [];
  }
}
