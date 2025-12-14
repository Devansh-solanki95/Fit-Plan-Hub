package com.fit.config;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.fit.entity.Users;
import com.fit.service.UserService;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter 
{
    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    @Lazy   // ✅ THIS FIXES THE CIRCULAR DEPENDENCY
    private UserService userDetailsService;

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) throws ServletException 
    {
        return request.getRequestURI().contains("/user") ||
               request.getRequestURI().contains("/swagger-ui") || 
               request.getRequestURI().contains("/v3/api-docs");
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws IOException, ServletException 
    {
        final String authHeader = request.getHeader("Authorization");
        System.out.println(authHeader);
        final String jwt;
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }


        jwt = authHeader.substring(7);

        boolean expiryStatus = jwtUtils.isTokenExpired(jwt);
        if (expiryStatus) {
            response.setStatus(403);
            response.getWriter().write("Token Expire !");
            return ;
        } else {
            int userid = jwtUtils.extractUserID(jwt);
            Users user = userDetailsService.getById(userid);

            UsernamePasswordAuthenticationToken authToken =
                    new UsernamePasswordAuthenticationToken(
                            user, null, user.getAuthorities());

            SecurityContextHolder.getContext().setAuthentication(authToken);
            filterChain.doFilter(request, response);
        }
    }
}
