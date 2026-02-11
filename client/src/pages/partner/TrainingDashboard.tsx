import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Award, Calendar, CheckCircle2, Clock, AlertCircle } from "lucide-react";

/**
 * Partner Training Dashboard
 * Displays courses, learning paths, certifications, and training progress
 */
export default function TrainingDashboard() {
  const { user, isAuthenticated } = useAuth();
  const [selectedCourse, setSelectedCourse] = useState<number | null>(null);

  // Fetch training data
  const coursesQuery = trpc.training.getCourses.useQuery({});
  const pathsQuery = trpc.training.getLearningPaths.useQuery({});
  const enrollmentsQuery = trpc.training.getMyEnrollments.useQuery({});
  const progressQuery = trpc.training.getTrainingProgress.useQuery();
  const eventsQuery = trpc.training.getUpcomingEvents.useQuery({});
  const certificationsQuery = trpc.training.getMyCertifications.useQuery();

  // Mutations
  const enrollMutation = trpc.training.enrollInCourse.useMutation();
  const registerEventMutation = trpc.training.registerForEvent.useMutation();

  if (!isAuthenticated) {
    return (
      <div className="container py-12">
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="pt-6">
            <p className="text-sm text-yellow-800">Please log in to access training materials.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleEnrollCourse = (courseId: number) => {
    enrollMutation.mutate(
      { courseId },
      {
        onSuccess: () => {
          enrollmentsQuery.refetch();
          progressQuery.refetch();
        },
      }
    );
  };

  const handleRegisterEvent = (eventId: number) => {
    registerEventMutation.mutate(
      { eventId },
      {
        onSuccess: () => {
          eventsQuery.refetch();
        },
      }
    );
  };

  return (
    <div className="container py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Training & Enablement</h1>
        <p className="text-lg text-gray-600">
          Advance your skills with our comprehensive training programs and certifications.
        </p>
      </div>

      {/* Training Progress Overview */}
      {progressQuery.data && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Courses Completed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {progressQuery.data.totalCoursesCompleted}/{progressQuery.data.totalCoursesEnrolled}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {progressQuery.data.overallProgressPercentage}% progress
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Active Certifications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{progressQuery.data.activeCertifications}</div>
              <p className="text-xs text-gray-500 mt-1">Valid certifications</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Learning Paths</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{progressQuery.data.completedLearningPaths}</div>
              <p className="text-xs text-gray-500 mt-1">Completed</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Compliance Status</CardTitle>
            </CardHeader>
            <CardContent>
              <Badge
                variant={progressQuery.data.complianceStatus === "Compliant" ? "default" : "destructive"}
              >
                {progressQuery.data.complianceStatus}
              </Badge>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Main Tabs */}
      <Tabs defaultValue="courses" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="courses">Courses</TabsTrigger>
          <TabsTrigger value="paths">Learning Paths</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="certifications">Certifications</TabsTrigger>
        </TabsList>

        {/* Courses Tab */}
        <TabsContent value="courses" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {coursesQuery.data?.map((course) => {
              const isEnrolled = enrollmentsQuery.data?.some((e) => e.course.id === course.id);
              return (
                <Card key={course.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg">{course.title}</CardTitle>
                        <CardDescription>{course.description}</CardDescription>
                      </div>
                      {course.isCertifiable && (
                        <Award className="h-5 w-5 text-yellow-500 ml-2" />
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline">{course.level}</Badge>
                      <Badge variant="outline">{course.category}</Badge>
                      <Badge variant="outline">{course.durationMinutes} min</Badge>
                    </div>

                    {isEnrolled ? (
                      <Button disabled className="w-full">
                        <CheckCircle2 className="h-4 w-4 mr-2" />
                        Enrolled
                      </Button>
                    ) : (
                      <Button
                        onClick={() => handleEnrollCourse(course.id)}
                        disabled={enrollMutation.isPending}
                        className="w-full"
                      >
                        {enrollMutation.isPending ? "Enrolling..." : "Enroll Now"}
                      </Button>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* Learning Paths Tab */}
        <TabsContent value="paths" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pathsQuery.data?.map((path) => (
              <Card key={path.id}>
                <CardHeader>
                  <CardTitle className="text-lg">{path.title}</CardTitle>
                  <CardDescription>{path.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600">
                      {path.estimatedHours} hours estimated
                    </span>
                  </div>

                  {path.awardsCertification && (
                    <div className="flex items-center gap-2">
                      <Award className="h-4 w-4 text-yellow-500" />
                      <span className="text-sm font-medium">Earns Certification</span>
                    </div>
                  )}

                  <Button variant="outline" className="w-full">
                    View Path
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Events Tab */}
        <TabsContent value="events" className="space-y-4">
          <div className="space-y-4">
            {eventsQuery.data?.map((event) => (
              <Card key={event.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle>{event.title}</CardTitle>
                      <CardDescription>{event.description}</CardDescription>
                    </div>
                    <Badge>{event.eventType}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Start Time</p>
                      <p className="font-medium">
                        {new Date(event.scheduledStartAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">Instructor</p>
                      <p className="font-medium">{event.instructorName || "TBD"}</p>
                    </div>
                  </div>

                  {event.maxAttendees && (
                    <div className="flex items-center gap-2 text-sm">
                      <AlertCircle className="h-4 w-4" />
                      <span>
                        {event.registeredCount || 0} / {event.maxAttendees} registered
                      </span>
                    </div>
                  )}

                  <Button
                    onClick={() => handleRegisterEvent(event.id)}
                    disabled={registerEventMutation.isPending}
                    className="w-full"
                  >
                    {registerEventMutation.isPending ? "Registering..." : "Register"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Certifications Tab */}
        <TabsContent value="certifications" className="space-y-4">
          {certificationsQuery.data && certificationsQuery.data.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {certificationsQuery.data.map((cert) => (
                <Card key={cert.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{cert.certificationName}</CardTitle>
                        <CardDescription>{cert.certificationLevel}</CardDescription>
                      </div>
                      <Award className="h-6 w-6 text-yellow-500" />
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Issued</p>
                        <p className="font-medium">
                          {new Date(cert.issuedAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600">Expires</p>
                        <p className="font-medium">
                          {new Date(cert.expiresAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <Badge
                      variant={cert.status === "Active" ? "default" : "destructive"}
                    >
                      {cert.status}
                    </Badge>

                    {cert.certificateUrl && (
                      <Button variant="outline" className="w-full" asChild>
                        <a href={cert.certificateUrl} target="_blank" rel="noopener noreferrer">
                          View Certificate
                        </a>
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="pt-6">
                <p className="text-center text-gray-600">
                  No certifications yet. Complete courses to earn certifications.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
