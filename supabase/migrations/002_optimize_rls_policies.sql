-- Optimize RLS policies for better performance
-- Replace auth.uid() with (select auth.uid()) to avoid re-evaluation for each row

-- Drop existing policies for reminders table
DROP POLICY IF EXISTS "Users can view their own reminders" ON reminders;
DROP POLICY IF EXISTS "Users can insert their own reminders" ON reminders;
DROP POLICY IF EXISTS "Users can update their own reminders" ON reminders;
DROP POLICY IF EXISTS "Users can delete their own reminders" ON reminders;

-- Create optimized policies for reminders table
CREATE POLICY "Users can view their own reminders" ON reminders FOR SELECT USING ((select auth.uid()) = user_id);
CREATE POLICY "Users can insert their own reminders" ON reminders FOR INSERT WITH CHECK ((select auth.uid()) = user_id);
CREATE POLICY "Users can update their own reminders" ON reminders FOR UPDATE USING ((select auth.uid()) = user_id);
CREATE POLICY "Users can delete their own reminders" ON reminders FOR DELETE USING ((select auth.uid()) = user_id);

-- Drop existing policies for events table
DROP POLICY IF EXISTS "Users can view their own events" ON events;
DROP POLICY IF EXISTS "Users can insert their own events" ON events;
DROP POLICY IF EXISTS "Users can update their own events" ON events;
DROP POLICY IF EXISTS "Users can delete their own events" ON events;

-- Create optimized policies for events table
CREATE POLICY "Users can view their own events" ON events FOR SELECT USING ((select auth.uid()) = user_id);
CREATE POLICY "Users can insert their own events" ON events FOR INSERT WITH CHECK ((select auth.uid()) = user_id);
CREATE POLICY "Users can update their own events" ON events FOR UPDATE USING ((select auth.uid()) = user_id);
CREATE POLICY "Users can delete their own events" ON events FOR DELETE USING ((select auth.uid()) = user_id);

-- Drop existing policies for notifications table
DROP POLICY IF EXISTS "Users can view their own notifications" ON notifications;
DROP POLICY IF EXISTS "Users can insert their own notifications" ON notifications;
DROP POLICY IF EXISTS "Users can update their own notifications" ON notifications;
DROP POLICY IF EXISTS "Users can delete their own notifications" ON notifications;

-- Create optimized policies for notifications table
CREATE POLICY "Users can view their own notifications" ON notifications FOR SELECT USING ((select auth.uid()) = user_id);
CREATE POLICY "Users can insert their own notifications" ON notifications FOR INSERT WITH CHECK ((select auth.uid()) = user_id);
CREATE POLICY "Users can update their own notifications" ON notifications FOR UPDATE USING ((select auth.uid()) = user_id);
CREATE POLICY "Users can delete their own notifications" ON notifications FOR DELETE USING ((select auth.uid()) = user_id);

-- Drop existing policies for user_preferences table
DROP POLICY IF EXISTS "Users can view their own preferences" ON user_preferences;
DROP POLICY IF EXISTS "Users can insert their own preferences" ON user_preferences;
DROP POLICY IF EXISTS "Users can update their own preferences" ON user_preferences;
DROP POLICY IF EXISTS "Users can delete their own preferences" ON user_preferences;

-- Create optimized policies for user_preferences table
CREATE POLICY "Users can view their own preferences" ON user_preferences FOR SELECT USING ((select auth.uid()) = user_id);
CREATE POLICY "Users can insert their own preferences" ON user_preferences FOR INSERT WITH CHECK ((select auth.uid()) = user_id);
CREATE POLICY "Users can update their own preferences" ON user_preferences FOR UPDATE USING ((select auth.uid()) = user_id);
CREATE POLICY "Users can delete their own preferences" ON user_preferences FOR DELETE USING ((select auth.uid()) = user_id);
