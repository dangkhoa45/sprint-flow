"use client";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Container from "@mui/material/Container";
import Skeleton from "@mui/material/Skeleton";
import Typography from "@mui/material/Typography";

export default function ProjectLoading() {
  return (
    <Container maxWidth="xl">
      {/* Breadcrumbs Skeleton */}
      <Box sx={{ mb: 4 }}>
        <Skeleton variant="text" width={200} height={24} />
      </Box>

      {/* Project Header Skeleton */}
      <Card 
        sx={{ 
          mb: 4,
          backgroundColor: "#fff",
          border: "1px solid #e0e0e0",
          borderRadius: 2,
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
        }}
      >
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ mb: 3 }}>
            <Skeleton 
              variant="text" 
              width="60%" 
              height={48} 
              sx={{ backgroundColor: "#f0f0f0" }}
            />
            <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
              <Skeleton 
                variant="rounded" 
                width={100} 
                height={32} 
                sx={{ backgroundColor: "#f0f0f0" }}
              />
              <Skeleton 
                variant="rounded" 
                width={80} 
                height={32} 
                sx={{ backgroundColor: "#f0f0f0" }}
              />
            </Box>
            <Skeleton 
              variant="text" 
              width="80%" 
              height={20} 
              sx={{ backgroundColor: "#f0f0f0" }}
            />
          </Box>

          <Box sx={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
            {[1, 2, 3, 4].map((item) => (
              <Box
                key={item}
                sx={{
                  flex: 1,
                  minWidth: 200,
                  p: 2,
                  backgroundColor: "#f8f9fa",
                  borderRadius: 2,
                  border: "1px solid #e9ecef"
                }}
              >
                <Skeleton 
                  variant="text" 
                  width="60%" 
                  height={16} 
                  sx={{ backgroundColor: "#f0f0f0" }}
                />
                <Skeleton 
                  variant="text" 
                  width="40%" 
                  height={20} 
                  sx={{ backgroundColor: "#f0f0f0" }}
                />
              </Box>
            ))}
          </Box>
        </CardContent>
      </Card>

      {/* Tabs Skeleton */}
      <Card sx={{ borderRadius: 2, overflow: "hidden", border: "1px solid #e0e0e0" }}>
        <Box sx={{ p: 2, borderBottom: 1, borderColor: "#e0e0e0", backgroundColor: "#fff" }}>
          <Box sx={{ display: "flex", gap: 3 }}>
            {["Tổng quan", "Milestones", "Timeline", "Files"].map((tab) => (
              <Skeleton 
                key={tab}
                variant="rounded" 
                width={80} 
                height={32} 
                sx={{ backgroundColor: "#f0f0f0" }}
              />
            ))}
          </Box>
        </Box>
        
        <Box sx={{ p: 3, backgroundColor: "#fff" }}>
          <Box sx={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
            {[1, 2, 3].map((item) => (
              <Card 
                key={item}
                sx={{ 
                  flex: 1, 
                  minWidth: 300,
                  height: 200,
                  backgroundColor: "#fff",
                  border: "1px solid #e0e0e0",
                  borderRadius: 2
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Skeleton 
                    variant="text" 
                    width="70%" 
                    height={24} 
                    sx={{ backgroundColor: "#f0f0f0" }}
                  />
                  <Box sx={{ mt: 2 }}>
                    {[1, 2, 3, 4].map((row) => (
                      <Box 
                        key={row}
                        sx={{ 
                          display: "flex", 
                          justifyContent: "space-between", 
                          mb: 1,
                          p: 1,
                          backgroundColor: "#f8f9fa",
                          borderRadius: 2,
                          border: "1px solid #e9ecef"
                        }}
                      >
                        <Skeleton 
                          variant="text" 
                          width="40%" 
                          height={16} 
                          sx={{ backgroundColor: "#f0f0f0" }}
                        />
                        <Skeleton 
                          variant="text" 
                          width="30%" 
                          height={16} 
                          sx={{ backgroundColor: "#f0f0f0" }}
                        />
                      </Box>
                    ))}
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>
        </Box>
      </Card>
    </Container>
  );
} 